# frozen_string_literal: true

class Api::V1::BookmarksController < Api::BaseController
  before_action -> { doorkeeper_authorize! :read, :'read:bookmarks' }
  before_action :require_user!
  after_action :insert_pagination_headers

  respond_to :json

  def index
    @statuses = []
    if current_account.is_pro
      @statuses = load_statuses
    end
    render json: @statuses, each_serializer: REST::StatusSerializer, relationships: StatusRelationshipsPresenter.new(@statuses, current_user&.account_id)
  end

  private

  def load_statuses
    cached_bookmarks
  end

  def cached_bookmarks
    cache_collection(
      Status.reorder(nil).joins(:status_bookmarks).merge(results),
      Status
    )
  end

  def results
    @_results ||= account_bookmarks.paginate_by_id(
      limit_param(DEFAULT_STATUSES_LIMIT),
      params_slice(:max_id, :since_id, :min_id)
    )
  end

  def account_bookmarks
    current_account.status_bookmarks
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def next_path
    api_v1_bookmarks_url pagination_params(max_id: pagination_max_id) if records_continue?
  end

  def prev_path
    api_v1_bookmarks_url pagination_params(since_id: pagination_since_id) unless results.empty?
  end

  def pagination_max_id
    results.last.id
  end

  def pagination_since_id
    results.first.id
  end

  def records_continue?
    results.size == limit_param(DEFAULT_STATUSES_LIMIT)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end
end