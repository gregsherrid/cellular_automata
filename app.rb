require "sinatra"
require "better_errors"

require "sinatra/activerecord"

Dir["./lib/*.rb"].each { |file| require file }

configure :development do
	use BetterErrors::Middleware
	BetterErrors.application_root = __dir__
	require "pry"
end
configure :test do
	require "pry"
end

helpers Interpreter

get "/" do
	erb :home
end

get "/dsl_test" do
	erb :dsl_test
end