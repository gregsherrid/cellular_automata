require "sinatra"
require "sinatra/activerecord"
require "./db_config"

init_db

get "/" do
	erb :home
end