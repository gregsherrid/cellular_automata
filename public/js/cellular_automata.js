// Sets up the canvas, starts the automata running
function runAutomata() {
	var canvas = document.getElementById("cellDisplay");

	var gd = new Grid(canvas, {
		width: 500,
		height: 500,
		scale: 1
	});

	tickTimeTest(gd);
};

// Use for optizing tick time,
// It runs 1000 ticks with a simple tick function, then shuts down
function tickTimeTest(gd) {

	//Each color draws from the cell above it
	function tickDrawDown(cell, pixData) {
		cell.red = pixData[cell.north.redLoc];
		cell.green = pixData[cell.north.greenLoc];
		cell.blue = pixData[cell.north.blueLoc];
	}

	var startTime = Date.now();
	var count = 0;
	function runTick() {
		gd.tick(tickDrawDown);
		count += 1;
		if (count < 1000) {
			setTimeout(runTick, 1);
		} else {
			var endTime = Date.now();
			console.log("Done!");
			console.log("Start time: " + startTime);
			console.log("End time: " + endTime);
			console.log("Elapsed: " + (endTime - startTime));
		}
	};
	runTick();

}


function Grid(canvas, ops) {

	var width = ops.width;
	var height = ops.height;

	var scale = ops.scale;

	var dispWidth = width * scale;
	var dispHeight = height * scale;

	canvas.width = dispWidth;
	canvas.height = dispHeight;
	var context = canvas.getContext('2d');
	var imgd = context.getImageData(0, 0, dispWidth, dispHeight);
	var pixData  = imgd.data;

	var cells = loadCells();
	var cellCount = cells.length; // should == width * height

	for (var i=0; i<cellCount; i++) {
		cells[i].red   = Math.floor(Math.random() * 255);
		cells[i].green = Math.floor(Math.random() * 255);
		cells[i].blue  = Math.floor(Math.random() * 255);
	}

	prepareCanvas();
	commitState();

	this.tick = function(tickF) {
		for (var i=0; i<cellCount; i++) {
			tickF(cells[i], pixData);
		};
		commitState();
	}

	function loadCells() {
		var cellA = [];
		var tempCellLookup = {};
		function cellLookup(x, y) {
			x = (x + width) % width;
			y = (y + height) % height;
			return tempCellLookup[[x,y]];
		}

		for (var x=0; x<width; x++) {
			for (var y=0; y<height; y++) {
				var cell = new Cell(x, y, width, scale);

				cellA.push(cell);
				tempCellLookup[[x,y]] = cell;
			}
		}

		for (var i=0; i<cellA.length; i++) {
			var cell = cellA[i];
			cell.north     = cellLookup(cell.x,     cell.y - 1);
			cell.northeast = cellLookup(cell.x + 1, cell.y - 1);
			cell.east      = cellLookup(cell.x + 1, cell.y);
			cell.southeast = cellLookup(cell.x + 1, cell.y + 1);
			cell.south     = cellLookup(cell.x,     cell.y + 1);
			cell.southwest = cellLookup(cell.x - 1, cell.y + 1);
			cell.west      = cellLookup(cell.x - 1, cell.y);
			cell.northwest = cellLookup(cell.x - 1, cell.y - 1);
		}

		return cellA;
	}

	function prepareCanvas() {
		for (var i=0; i<cellCount; i++) {
			pixData[i*4*scale*scale + 3] = 255;
		}
		context.putImageData(imgd, 0, 0);
	}

	function commitState() {
		for (var i=0; i<cellCount; i++) {
			var cell = cells[i];

			// This works only with scale=1
			// pixData[loc] = cell.red;
			// pixData[loc + 1] = cell.green;
			// pixData[loc + 2] = cell.blue;

			for (var j=0; j<scale; j++) {
				for (var k=0; k<scale; k++) {
					var loc1 = cell.redLoc + (k * 4) + (width * scale * 4 * j);
					pixData[loc1] = cell.red;
					pixData[loc1 + 1] = cell.green;
					pixData[loc1 + 2] = cell.blue;					
				}
			}
		}
		context.putImageData(imgd, 0, 0);
	}
}

function Cell(x, y, width, scale, pixData) {
	this.x = x;
	this.y = y;

	// Loction of upper left-most pixel of this cell
	// on the canvas for the three colors
	this.redLoc = (y * width * scale * scale + x * scale) * 4;
	this.greenLoc = this.redLoc + 1;
	this.blueLoc = this.redLoc + 2;

	this.red = null;
	this.green = null;
	this.blue = null;

	// this.readRed = function() { return pixData[this.loc] }
	// this.readGreen = function() { return pixData[this.loc + 1] }
	// this.readBlue = function() { return pixData[this.loc + 2] }

	this.newRed = null;
	this.newGreen = null;
	this.newBlue = null;

	this.north = null;
	this.northeast = null;
	this.east = null;
	this.southeast = null;
	this.south = null;
	this.northeast = null;
	this.east = null;
	this.southeast = null;
	this.south = null;

	this.commit = function() {
		this.red = this.newRed;
		this.green = this.newGreen;
		this.blue = this.newBlue;
	};
}

runAutomata();





