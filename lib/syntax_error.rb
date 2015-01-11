class ProgramSyntaxError < StandardError
	def initialize(base = "Syntax Error", value = nil)
		super(value.blank? ? base : "#{base}: #{value}")
	end
end