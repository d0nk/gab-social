# frozen_string_literal: true

module UserTrackingConcern
  extend ActiveSupport::Concern

  UPDATE_SIGN_IN_HOURS = 24

  included do
    before_action :set_user_activity
  end

  private

  def set_user_activity
    ActiveRecord::Base.connected_to(role: :writing) do
      current_user.update_sign_in!(request) if user_needs_sign_in_update?
    end
  end

  def user_needs_sign_in_update?
    user_signed_in? && (current_user.current_sign_in_at.nil? || current_user.current_sign_in_at < UPDATE_SIGN_IN_HOURS.hours.ago)
  end
end
