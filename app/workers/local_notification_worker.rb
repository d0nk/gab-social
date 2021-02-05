# frozen_string_literal: true

class LocalNotificationWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'default', retry: 3

  def perform(receiver_account_id, activity_id = nil, activity_class_name = nil)
    return true if activity_id.nil? or activity_class_name.nil?

    receiver = Account.find(receiver_account_id)
    activity = activity_class_name.constantize.find(activity_id)

    NotifyService.new.call(receiver, activity)
  rescue ActiveRecord::RecordNotFound
    true
  end
end
