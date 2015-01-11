def init_db(env)
	config = YAML.load(File.open("./config.yml"))[env.to_s]["database"]

	url = "postgres://#{config['username']}:#{config['password']}@#{config['host']}:#{config['port']}/#{config['db_name']}"
	db = URI.parse(url)

	ActiveRecord::Base.establish_connection(
	  :adapter  => db.scheme == "postgres" ? "postgresql" : db.scheme,
	  :host     => db.host,
	  :username => db.user,
	  :password => db.password,
	  :database => db.path[1..-1],
	  :encoding => "utf8"
	)
end
