# frozen_string_literal: true

require 'similar_text'

class StatusSimilarityService < BaseService
  def call?(status_text = "", account_id = nil)
    @status_text = status_text
    @account_id = account_id

    # Not alike if no status_text or no account
    # : todo : come up with solution for same image spamming
    return false if @status_text.length == 0 || @account_id.nil?

    alike?
  end

  private

  def alike?
    last_status_text = nil
    key = "last_status_from_account:#{@account_id}"

    Redis.current.with do |conn|
      last_status_text = conn.get(key) || ""
      conn.setex(key, 300, @status_text)
    end

    if last_status_text.nil? || last_status_text.empty? || last_status_text.length == 0
      return false
    end

    likeness = last_status_text.similar(@status_text)

    likeness > 85
  end

end
