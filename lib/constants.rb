ATTRIBUTES = ["RED", "GREEN", "BLUE"]
NEIGHBORS = ["SELF", "NORTH", "NORTHEAST", "EAST", "SOUTHEAST", "SOUTH", "SOUTHWEST", "WEST"]

BASE_OPERATORS = ["/", "+", "*", "-", "%"]
COMPOUND_OPERATORS = BASE_OPERATORS.map { |s| s + "=" }
OPERATORS = BASE_OPERATORS + COMPOUND_OPERATORS + ["="]

# All operators sorted in reverse length order
LENGTH_SORTED_OPERATORS = OPERATORS.sort_by(&:length).reverse

# Regular expression for a parenthesis pair containing only non-parenthesis valid characters
PARENTHETICAL_REGEX = lambda do
	escaped_operators = OPERATORS.map { |op| Regexp.escape(op) }.join("|")

	# Has operators, letters, digits, periods, and placeholders ($)
	Regexp.new("\\([#{ escaped_operators }|\\w|\\.|\$]+\\)")
end.call