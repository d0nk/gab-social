# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  connects_to database: {
    writing: :master,
    reading: :slave1
  }
  self.abstract_class = true
  include Remotable
end
