# frozen_string_literal: true

class RemoveStatusService < BaseService
  include Redisable

  def call(status, **options)
    @payload      = Oj.dump(event: :delete, payload: status.id.to_s)
    @status       = status
    @account      = status.account
    @reblogs      = status.reblogs.includes(:account).to_a
    @options      = options

    RedisLock.acquire(lock_options) do |lock|
      if lock.acquired?
        remove_reblogs
        @status.destroy!
      else
        raise GabSocial::RaceConditionError
      end
    end

    # There is no reason to send out Undo activities when the
    # cause is that the original object has been removed, since
    # original object being removed implicitly removes reblogs
    # of it. The Delete activity of the original is forwarded
    # separately.
    return if !@account.local? || @options[:original_removed]
  end

  private

  def remove_reblogs
    # We delete reblogs of the status before the original status,
    # because once original status is gone, reblogs will disappear
    # without us being able to do all the fancy stuff

    @reblogs.each do |reblog|
      RemoveStatusService.new.call(reblog, original_removed: true)
    end
  end

  def lock_options
    { redis: Redis.current, key: "distribute:#{@status.id}" }
  end
end
