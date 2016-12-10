require "./spec/spec_helper.rb"

describe "| Interpreter" do

	describe "| Assignment" do
		it "| Cells" do
			source = [
				"RED=EAST.RED",
				"GREEN=EAST.GREEN",
				"BLUE=EAST.BLUE"
			]

			InterpretedProgram.new(source).js_lines.should == [
				"cell.red = pixData[cell.east.redLoc];",
				"cell.green = pixData[cell.east.greenLoc];",
				"cell.blue = pixData[cell.east.blueLoc];"
			]
		end

		it "| Tricky assignment should be allowed" do
			source = ["10 + (RED = (BLUE = 8 + 10))"]
			InterpretedProgram.new(source).js_lines.should == [
				"10 + ( cell.red = ( cell.blue = 8 + 10 ) );"
			]
		end
	end

	describe "| Arithmetic" do
		it "| Addition, Subtraction, Division, Multiplication, Mod" do
			source = [
				"RED=NORTHEAST.GREEN - 2",
				"GREEN= RED / 2 + 100",
				"BLUE = SOUTH.BLUE * 8.3 % 100"
			]

			InterpretedProgram.new(source).js_lines.should == [
				"cell.red = pixData[cell.northeast.greenLoc] - 2;",
				"cell.green = cell.red / 2 + 100;",
				"cell.blue = pixData[cell.south.blueLoc] * 8.3 % 100;"
			]
		end

		it "| Assignment with addition, Subtraction, Division, Multiplication, Mod" do
			source = [
				"RED += 1 + SOUTHEAST.BLUE",
				"BLUE *= 2",
				"GREEN -= 1.5",
				"RED /= 0.3",
				"BLUE %= 256"
			]

			InterpretedProgram.new(source).js_lines.should == [
				"cell.red += 1 + pixData[cell.southeast.blueLoc];",
				"cell.blue *= 2;",
				"cell.green -= 1.5;",
				"cell.red /= 0.3;",
				"cell.blue %= 256;"
			]
		end
	end

	it "| Extra white spaces doesn't cause problems" do
		source = [
			"  RED   =   NORTH.RED   * 0.8  "
		]

		InterpretedProgram.new(source).js_lines.should == [
			"cell.red = pixData[cell.north.redLoc] * 0.8;"
		]
	end

	describe "| Parenthesis" do
		it "| Basic" do
			source = [
				"BLUE = (WEST.RED * 2) % (WEST.BLUE - 1)"
			]
			InterpretedProgram.new(source).js_lines.should == [
				"cell.blue = ( pixData[cell.west.redLoc] * 2 ) % ( pixData[cell.west.blueLoc] - 1 );"
			]
		end

		it "| Nested" do
			source = ["BLUE = (WEST.RED * (8 + 9)) % 7"]
			InterpretedProgram.new(source).js_lines.should == [
				"cell.blue = ( pixData[cell.west.redLoc] * ( 8 + 9 ) ) % 7;"
			]
		end

		it "| Unmatched Parenthesis" do
			source = ["RED=10+(15"]
			expect do
				InterpretedProgram.new(source)
			end.to raise_error(ProgramSyntaxError)
		end
	end

	describe "| Variables" do
		it "| Variable assignment and reference" do
			source = [
				"B1=EAST.BLUE",
				"SQUID_2=NORTH.RED%10",
				"B1+=WEST.BLUE",
				"BLUE=B1/2",
				"RED=SQUID_2"
			]

			InterpretedProgram.new(source).js_lines.should == [
				"var v1 = pixData[cell.east.blueLoc];",
				"var v2 = pixData[cell.north.redLoc] % 10;",
				"v1 += pixData[cell.west.blueLoc];",
				"cell.blue = v1 / 2;",
				"cell.red = v2;"
			]
		end
	end

end