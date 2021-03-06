# frozen_string_literal: true

class IntroduceAccountProWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'mailers', retry: 2

  attr_reader :user

  def perform(acct_id, date_range)
    @acct = Account.find(acct_id)
    deliver_email(date_range)
  end

  private

  def deliver_email(date_range)
    return if @acct.nil? or @acct.user.nil?
    UserMailer.introduce_pro(@acct.user, date_range).deliver_now!
    @acct.user.touch(:last_emailed_at)
  end
end
