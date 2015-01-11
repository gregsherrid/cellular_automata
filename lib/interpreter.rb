module Interpreter

	# Each color draws from the cell above it
	# function tickDrawDown(cell, pixData) {
	# 	cell.red = pixData[cell.north.redLoc];
	# 	cell.green = pixData[cell.north.greenLoc];
	# 	cell.blue = pixData[cell.north.blueLoc];
	# }

	def sample_program
		source = [
			"RED=EAST.RED",
			"GREEN=EAST.GREEN",
			"BLUE=EAST.BLUE"
		]
		# source = ["a = 10 + 20 - 10 - 10"]
		ip = InterpretedProgram.new(source)

		"<script type='text/javascript'>
			function currentTickFunction(cell, pixData) {
				#{ip.js_lines.join("\n")}
			}
		</script>"
	end
end