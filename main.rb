require "sinatra"
require "sinatra/activerecord"
require "./lib/grid_builder.rb"

# helpers GridBuilder

get "/" do
	erb :home
end