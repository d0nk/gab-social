# frozen_string_literal: true

class Auth::ConfirmationsController < Devise::ConfirmationsController
  layout 'auth'

  before_action :set_body_classes
  before_action :require_unconfirmed!
  before_action :set_user, only: [:finish_signup]

  def require_unconfirmed!
    redirect_to edit_user_registration_path if user_signed_in? && current_user.confirmed? && current_user.unconfirmed_email.blank?
  end

  def finish_signup
    return unless request.patch? && params[:user]
    @user.email = current_user.unconfirmed_email || current_user.email if user_signed_in?
  end

  private

  def set_user
    @user = current_user
  end

  def set_body_classes
    @body_classes = ''
  end

  def user_params
    params.require(:user).permit(:email)
  end

  def after_confirmation_path_for(_resource_name, user)
    if user.created_by_application && truthy_param?(:redirect_to_app)
      user.created_by_application.redirect_uri
    else
      super
    end
  end
end
