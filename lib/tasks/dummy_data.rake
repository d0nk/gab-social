# frozen_string_literal: true

desc 'Import dummy data into the database, to create a more realistic development experience'
task dummy_data: :environment do
  raise 'Only run this in development' unless Rails.env.development?

  domain = ENV['LOCAL_DOMAIN'] || Rails.configuration.x.local_domain

  admin = Account.find_by!(username: 'admin')

  accounts = 1.upto(1_000).map do |num|
    username = "#{Faker::Internet.username(separators: %w[_])}#{num}"
    password = Faker::Internet.password

    Account.create!(username: username).tap do |account|
      account.create_user!({
        email: "#{username}@#{domain}",
        password: password,
        password_confirmation: password,
        agreement: true,
        approved: true
      })
    end
  end

  accounts.each do |acct|
    FollowService.new.call(admin, acct)
  end

  statuses = (accounts + [admin]).map do |account|
    PostStatusService.new.call(account, text: Faker::Lorem.paragraph(sentence_count: 20))
  end

  accounts.sample(200).zip(statuses.sample(200)).each do |account, status|
    ReblogService.new.call(account, status)
  end
end
