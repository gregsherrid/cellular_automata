class InterpretedProgram
	attr_accessor :js_lines

	def initialize(source)
		source = source.map { |s| s.upcase.gsub(" ", "") }
		@variables = Set.new

		# When we need a place holder (take form: $12$), use this counter
		@placeholder_counter = 0

		self.js_lines = []
		source.each do |s|
			js_lines << self.parse_expression(s)
		end
	end

	def parse_expression(exp)
		tokens = reduce_to_tokens(exp)
		tokens.map(&:js_value).join(" ") << ";"
	end

	def reduce_to_tokens(exp)
		tokens = reduce_expression(exp).flatten

		tokens.map do |comp|
			Token.init(comp)
		end
	end

	private

		# Recursive method takes an expression and returns nested lists
		# of irreducible tokens
		def reduce_expression(exp)

			# Hand lines with parenthesis off to a helper method
			if has_parenthesis?(exp)
				return reduce_parenthesis_expression(exp)
			end

			LENGTH_SORTED_OPERATORS.each do |op|
				# Don't try to reduce an operator further
				# Otherwide we'd try to split up += into + and =
				if op == exp
					return [exp]
				end

				# Try to split the expression by the operator
				# If it can be split, recurse on the split pieces and intersperse
				# the results with the operator tokens
				exp_split = exp.split(op)
				if exp_split.length > 1

					# sub_expressions is an array with one or more tokens or subarrays
					sub_expressions = exp_split.map do |sub_exp|
						reduce_expression(sub_exp)
					end

					# Insert the operator at the end of all the exp lists except the last
					sub_expressions.first(sub_expressions.length - 1).each do |exp_list|
						exp_list.push(op)
					end

					return sub_expressions
				end

				# If we haven't returned yet, move on to the next operator
			end

			# If we've reached the end of the operators and never returned,
			#    exp must be a token
			return [exp]
		end

		# Recursively solve expressions with parenthesis
		def reduce_parenthesis_expression(exp)
			# There should always be at least one innermost parenthesis pair
			if PARENTHETICAL_REGEX =~ exp
				placeholder = get_next_placeholder

				# Get the tokens for the clause within the parenthesis
				paren_clause = exp[PARENTHETICAL_REGEX]
				sub_exp_tokens = reduce_expression(paren_clause[1..-2])

				# Replace the clause with a placeholder
				new_exp = exp.sub(PARENTHETICAL_REGEX, placeholder)

				reduced_tokens = reduce_expression(new_exp).flatten
				placeholder_index = reduced_tokens.index(placeholder)

				if placeholder_index.nil?
					raise ProgramSyntaxError.new("Syntax Error (Missing Parenthesis Placeholder)", exp)
				end

				# Reinsert the tokenized clause with wrapping parenthesis
				reduced_tokens[placeholder_index] = ["(", sub_exp_tokens, ")"]
				return reduced_tokens

			else
				# There was an unmatched parenthesis
				raise ProgramSyntaxError.new("Syntax Error (Parenthesis)", exp)
			end
		end

		def has_parenthesis?(exp)
			exp.include?("(") || exp.include?(")")
		end

		def get_next_placeholder
			"$#{ @placeholder_counter += 1 }$"
		end
end