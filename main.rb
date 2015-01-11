require "sinatra"
require "better_errors"

require "sinatra/activerecord"
require "./db_config"

Dir["./lib/*.rb"].each {|file| require file }

set :environment, :development

configure :development do
	use BetterErrors::Middleware
	BetterErrors.application_root = __dir__

	init_db(:development)
end

helpers Interpreter

get "/" do
	erb :home
end