# frozen_string_literal: true

class Auth::RegistrationsController < Devise::RegistrationsController
  layout :determine_layout

  before_action :check_enabled_registrations, only: [:new, :create]
  before_action :configure_sign_up_params, only: [:create]
  before_action :set_sessions, only: [:edit, :update]
  before_action :set_instance_presenter, only: [:new, :create, :update]
  before_action :set_body_classes, only: [:new, :create, :edit, :update]
  before_action :set_cache_headers, only: [:edit, :update]
  prepend_before_action :check_form_submission_speed, only: [:create]
  prepend_before_action :check_if_password_email_identical, only: [:create]
  if ENV.fetch('GAB_CAPTCHA_CLIENT_KEY', '').empty? || ENV.fetch('GAB_CAPTCHA_CLIENT_KEY', '').nil?
    # captcha disabled if key not defined
  else
    prepend_before_action :check_captcha, only: [:create]
  end

  def new
    set_challenge_buster
    super
  end

  def create
    set_challenge_buster
    super
  end

  def destroy
    not_found
  end

  protected

  def update_resource(resource, params)
    params[:password] = nil if Devise.pam_authentication && resource.encrypted_password.blank?
    super
  end

  def build_resource(hash = nil)
    super(hash)

    resource.locale             = I18n.locale
    resource.agreement          = true
    resource.current_sign_in_ip = request.headers['True-Client-IP'] || request.remote_ip

    resource.build_account if resource.account.nil?
  end

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up) do |u|
      u.permit({ account_attributes: [:username] }, :email, :password, :password_confirmation)
    end
  end

  def after_sign_up_path_for(_resource)
    new_user_session_path
  end

  def after_inactive_sign_up_path_for(_resource)
    new_user_session_path
  end

  def after_update_path_for(_resource)
    edit_user_registration_path
  end

  private

  def check_form_submission_speed
    if session[:registration_form_time] > 5.seconds.ago
      flash[:alert] = I18n.t('auth.too_fast')
      respond_with_navigational(resource) {
        redirect_to new_user_registration_path
      }
    end
  end

  def check_if_password_email_identical
    if params[:user][:email] == params[:user][:password]
      flash[:alert] = "Your email cannot be your password. Please enter a new password."
      respond_with_navigational(resource) {
        redirect_to new_user_registration_path
      }
    end
  end

  def check_captcha
    unless passed_challenge?(params["gab-captcha-st"], params[:user])
      self.resource = resource_class.new configure_sign_up_params
      resource.validate # Look for any other validation errors besides reCAPTCHA
      flash[:captcha_error] = "Incorrect text. Please try again."
      set_challenge_buster
      respond_with_navigational(resource) {
        redirect_to new_user_registration_path
      }
    end 
  end

  def set_instance_presenter
    @instance_presenter = InstancePresenter.new
  end

  def set_body_classes
    @body_classes = %w(edit update).include?(action_name) ? 'admin' : ''
  end

  def set_challenge_buster
    @challenge_buster = SecureRandom.hex
    session[:registration_form_time] = Time.now.utc
  end

  def passed_challenge?(serverToken, userParams)
    # Log if captcha keys not present in ENV
    if ENV.fetch('GAB_CAPTCHA_CLIENT_KEY', '').empty? || ENV.fetch('GAB_CAPTCHA_CLIENT_KEY', '').nil?
      Rails.logger.debug "RegistrationsController: GAB_CAPTCHA_CLIENT_KEY is undefined"
    end

    # Log and return false is captcha key is not present. This will disallow anyone from signing up
    if ENV.fetch('GAB_CAPTCHA_SECRET_KEY', '').empty? || ENV.fetch('GAB_CAPTCHA_SECRET_KEY', '').nil?
      Rails.logger.debug "RegistrationsController: GAB_CAPTCHA_SECRET_KEY is undefined"
      return false
    end

    typedChallenge = userParams[:challenge]
    username = userParams[:account_attributes][:username]

    return false if serverToken.nil? || serverToken.empty? || typedChallenge.nil? || typedChallenge.empty?
    
    Request.new(:post, "https://captcha.gab.com/captcha/#{serverToken}/verify", form: {
      "serverKey" => ENV.fetch('GAB_CAPTCHA_SECRET_KEY', ''),
      "value" => typedChallenge,
      "username" => username,
      "ip" => request.headers['True-Client-IP'] || request.remote_ip
    }).perform do |res|
      body = JSON.parse(res.body_with_limit)
      result = !!body["success"]
      return result
    end
  end

  def determine_layout
    %w(edit update).include?(action_name) ? 'admin' : 'auth'
  end

  def set_sessions
    @sessions = current_user.session_activations
  end

  def set_cache_headers
    response.headers['Cache-Control'] = 'no-cache, no-store, max-age=0, must-revalidate'
  end

  def check_enabled_registrations
    redirect_to root_path if single_user_mode? || !allowed_registrations?
  end

  def allowed_registrations?
    Setting.registrations_mode != 'none'
  end

end
