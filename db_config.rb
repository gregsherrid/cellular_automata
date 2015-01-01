env = "development"
DB_CONFIG = YAML.load(File.open("./config.yml"))[env]["database"]

def init_db
	url = "postgres://#{DB_CONFIG['username']}:#{DB_CONFIG['password']}@#{DB_CONFIG['host']}:#{DB_CONFIG['port']}/#{DB_CONFIG['db_name']}"
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
