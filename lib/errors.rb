class ProgramSyntaxError < StandardError
	def initialize(base = "Program Syntax Error", value = nil)
		super(value.blank? ? base : "#{base}: #{value}")
	end
end

class InterpreterError < StandardError
	def initialize(base = "Interpreter Error", value = nil)
		super(value.blank? ? base : "#{base}: #{value}")
	end
end