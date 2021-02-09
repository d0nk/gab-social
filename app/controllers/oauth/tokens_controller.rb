# frozen_string_literal: true

class Oauth::TokensController < Doorkeeper::TokensController
  include ForceDbWriterRole
  around_action :force_writer_db_role, only: :revoke

  def revoke
    unsubscribe_for_token if authorized? && token.accessible?
    super
  end

  private

  def unsubscribe_for_token
    Web::PushSubscription.where(access_token_id: token.id).delete_all
  end
end
