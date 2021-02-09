module ForceDbWriterRole
  extend ActiveSupport::Concern
  # This is intended to be used as an around_action hook for GET
  # endpoints that need to perform writes to ActiveRecord
  def force_writer_db_role
    ActiveRecord::Base.connected_to(role: :writing) do
      yield
    end
  end
end
