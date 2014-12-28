function runAutomata() {
	var canvas = document.getElementById("cellDisplay");
	var gd = new GridDisplay(canvas, {
		height: 120,
		width: 250,
		scale: 3
	});
};

function GridDisplay(canvas, ops) {

	var width = ops.width;
	var height = ops.height;
	var scale = ops.scale;
	var dispWidth = width * scale;
	var dispHeight = height * scale;

	canvas.width = dispWidth;
	canvas.height = dispHeight;

	var context = canvas.getContext('2d');
	var imgd = context.getImageData(0, 0, dispWidth, dispHeight);

	function initDisplay() {

		var pix = imgd.data;
		var grid = toGrid(pix, width, height, scale);

		for (var i=0; i<width; i++) {
			for (var j=0; j<height; j++) {
				grid[i][j][3] = 255;

				var red = Math.floor(Math.random() * 255);
				var green = Math.floor(Math.random() * 255);
				var blue = Math.floor(Math.random() * 255);
				grid[i][j][0] = red;
				grid[i][j][1] = green;
				grid[i][j][2] = blue;
			}
		}

		toPixList(grid, pix, scale);
		context.putImageData(imgd, 0, 0);
		return grid;
	}

	initDisplay();

	function toGrid(pix, w, h, scale) {

		var grid = [];

		for (var x=0; x<w; x++) {
			var col = [];
			grid.push(col);
			for ( var y=0; y<h; y++ ) {
				var pt = [];
				col.push(pt);

				var at = y*w*scale*scale*4 + x*scale*4;

				//Copy each part of pixel
				for ( var i=0; i<4; i++ ) {
					grid[x][y][i] = pix[at+i];
				}
			}
		}

		return grid;
	}

	//Above function in reverse, feeds into original array
	//returns the array
	function toPixList( grid, pix, scale ) {

		var w = grid.length;
		var h = grid[0].length;

		//should equal length of pix
		var cap = w*h*scale*scale*4;

		for ( var i=0; i<cap; i+=4 ) {

			var at = Math.floor( ( i/4 ) / scale );
			var x = at % w;
			var y = Math.floor( at / ( w*scale ) );

			for ( var j=0; j<4; j++ ) {
				pix[i+j] = grid[x][y][j];
			}
		}

		return pix;
	}

	function cloneGrid( grid ) {

		var w = grid.length;
		var h = grid[0].length;

		var newGrid = [];
		for ( var x=0; x<w; x++ ) {

			var col = [];
			newGrid.push( col );

			for ( var y=0; y<h; y++ ) {

				var pt = [];
				col.push( pt );
				newGrid[x][y][0] = grid[x][y][0];
				newGrid[x][y][1] = grid[x][y][1];
				newGrid[x][y][2] = grid[x][y][2];
				newGrid[x][y][3] = grid[x][y][3];
			}
		}
		return newGrid;
	}
}

runAutomata();