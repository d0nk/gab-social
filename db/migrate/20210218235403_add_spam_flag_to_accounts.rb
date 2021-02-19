class AddSpamFlagToAccounts < ActiveRecord::Migration[6.0]
  def change
  	add_column :accounts, :spam_flag, :integer, null: true
  end
end
