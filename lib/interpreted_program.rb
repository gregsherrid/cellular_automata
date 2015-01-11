class InterpretedProgram
	attr_accessor :js_lines

	def initialize(source)
		source.map!(&:upcase).map!{|s| s.gsub(" ", "") }
		@variables = Set.new

		self.js_lines = []
		source.each do |s|
			js_lines << InterpretedProgram.parse_expression(s)
		end
	end

	def self.parse_expression(exp)
		tokens = reduce_to_tokens(exp)
		tokens.map(&:js_value).join(" ") << ";"
	end

	def self.reduce_to_tokens(exp)
		tokens = [exp]
		OPERATORS.each do |op|
			tokens.each_with_index do |comp, i|
				pieces = comp.split(op)
				tokens[i] = []
				tokens[i].push pieces.shift
				until pieces.empty?
					tokens[i].push op
					tokens[i].push pieces.shift
				end
			end
			tokens.flatten!
		end

		tokens.map do |comp|
			Token.init(comp)
		end
	end
end