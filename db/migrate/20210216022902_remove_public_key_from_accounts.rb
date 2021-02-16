class RemovePublicKeyFromAccounts < ActiveRecord::Migration[6.0]
  def change
    safety_assured { remove_column :accounts, :public_key, :text }
  end
end
