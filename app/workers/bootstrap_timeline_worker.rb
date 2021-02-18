# frozen_string_literal: true

class BootstrapTimelineWorker
  include Sidekiq::Worker

  def perform(account_id)
    ActiveRecord::Base.connected_to(role: :writing) do
      BootstrapTimelineService.new.call(Account.find(account_id))
    end
  end
end
