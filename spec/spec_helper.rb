require "sinatra"

set :environment, :test
require "./app.rb"

RSpec.configure do |config|
	config.expect_with :rspec do |c|
		c.syntax = [:should, :expect]
	end
end
