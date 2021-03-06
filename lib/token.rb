class Token
	attr_accessor :value

	def initialize(val)
		self.value = val
	end

	# Default, frequently overridden
	def js_value
		value
	end

	def to_s
		"#{self.class}: #{value}"
	end

	def self.init(s, variable_mapper: nil)
		if s == "="
			AssignmentToken.new(s)

		elsif OPERATORS.include?(s) || is_number?(s) || ["(", ")"].include?(s)
			OperatorToken.new(s)

		elsif ATTRIBUTES.include?(s)
			CellAttributeToken.new(s)

		elsif is_valid_variable?(s)
			VariableToken.new(s, variable_mapper: variable_mapper)

		elsif is_neighbor_attribute?(s)
			NeighborAttributeToken.new(s)

		else
			raise ProgramSyntaxError.new("Unrecognized Token", s)
		end
	end

	def self.is_number?(s)
		Float(s) != nil rescue false
	end

	def self.is_valid_variable?(s)
		!(s =~ /[^A-Z1-9_]/)
	end

	def self.is_neighbor_attribute?(s)
		a = s.split(".")
		a.length == 2 && NEIGHBORS.include?(a[0]) && ATTRIBUTES.include?(a[1])
	end

	def self.attribute_name(s)
		if ATTRIBUTES.include?(s)
			s.downcase
		else
			raise ProgramSyntaxError.new("Unknown Attribute", s)
		end
	end

	def self.neighbor_name(s)
		if NEIGHBORS.include?(s)
			s.downcase
		else
			raise ProgramSyntaxError.new("Unknown Neighbor", s)
		end
	end
end

class OperatorToken < Token
end

class AssignmentToken < Token
end

class ValueToken < Token
end

class NumberLiteralToken < ValueToken
end

class CellAttributeToken < ValueToken
	def js_value
		"cell.#{Token.attribute_name(value)}"
	end
end

class NeighborAttributeToken < ValueToken
	def js_value
		neighbor_str, attribute_str = value.split(".")
		neighbor = Token.neighbor_name(neighbor_str)
		attribute = Token.attribute_name(attribute_str)

		"pixData[cell.#{neighbor}.#{attribute}Loc]"
	end
end

class VariableToken < ValueToken
	def initialize(val, variable_mapper: nil)
		super(val)

		if variable_mapper.nil?
			raise InterpreterError.new("Interpreter Error (Variable Token Requires Map)", exp)
		end

		@is_first_occurance = variable_mapper.new_variable?(val)
		@var_name = variable_mapper.get_variable_name(val)
	end

	def js_value
		if @is_first_occurance
			"var #{ @var_name }"
		else
			@var_name
		end
	end
end

