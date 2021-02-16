class RemovePrivateKeyFromAccounts < ActiveRecord::Migration[6.0]
  def change
    safety_assured { remove_column :accounts, :private_key, :text }
  end
end
