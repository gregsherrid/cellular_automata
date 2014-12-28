//Emergent pixels in a display
//(c)2013, Gregory Sherrid

//Number of cells. May be modified by scale on canvas
var cWidth = 60;
var cHeight = 60;

var dispScale = 8;

var context = canvasSetup( dispScale );
var imgd = context.getImageData( 0, 0, cWidth*dispScale, cHeight*dispScale );

//We have two grids, which swap off being the current
//and past grid. We do this to save constatly copying
//the data back over
//var gridA = initDisplay( startFullRand, dispScale );
//var gridA = initDisplay( startBinary, dispScale );
var gridA = initDisplay( startLowRedRand, dispScale );
//var gridA = initDisplay( startGBRand, dispScale );

var gridB = cloneGrid( gridA );

var aIsCurrent = true;tickAdjDif
//setInterval( composeTickFunction( tickDrawDown, dispScale ), 1 );
//setInterval( composeTickFunction( tickAdjDif, dispScale ), 100 );
//setInterval( composeTickFunction( tickRiseDrop, dispScale ), 100 );
setInterval( composeTickFunction( tickCopyChain, dispScale ), 5 );
//setInterval( composeTickFunction( tickGrouping, dispScale ), 10 );

function composeTickFunction( tickF, scale ) {
    
    return function() {

	var newGrid, oldGrid;
	if ( aIsCurrent ) {
	    oldGrid = gridA;
	    newGrid = gridB;
	} else {
	    oldGrid = gridB;
	    newGrid = gridA;
	}
	aIsCurrent = !aIsCurrent;

	//As we run, we read out of oldGrid
	//and feed values into newGrid

	for ( var i=0; i<cWidth; i++ ) {
	    for ( var j=0; j<cHeight; j++ ) {
		tickF( i, j, oldGrid, newGrid );
	    }
	}
	toPixList( newGrid, imgd.data, scale );
	context.putImageData( imgd, 0, 0 );
    }
}

function tickCopyChain( x, y, oldGrid, newGrid ) {
    var adj = getFullAdjacent( x, y, oldGrid );
    var adjL = adj.length;

    //oldGrid[x][y][0] = Math.floor( Math.random() * 16 );
    
    var red = oldGrid[x][y][0];
    var which = null;
    if ( red < 0 ) {
        which = 0;
    } else if ( red <= 7 ) {
        which = 2;
    } else {
        which = 1;
    }

    newGrid[x][y][0] = red;
    newGrid[x][y][1] = adj[which][1];
    newGrid[x][y][2] = adj[which][2];
}

function tickExplode( x, y, oldGrid, newGrid ) {

    var s_z = 10;
    
    var red = oldGrid[x][y][0];
    
    //May overwrite
    newGrid[x][y][1] = oldGrid[x][y][1];
    newGrid[x][y][2] = oldGrid[x][y][2];

    if ( Math.random() < 0.0005 ) {
	red = s_z;
    } else if ( red > 0 ) {
	red--;
    } else {
	
	var adj = getAdjacent( x, y, oldGrid );
	var adjL = adj.length;
	
	var off = Math.floor( Math.random()*4 );
	for ( var i=0; i<adjL; i++ ) {
	    
	    var at = ( i+off ) % adjL;

	    if ( adj[at][0] == s_z ) {
 
		if ( Math.random() > 0.0 ) {
		    red = s_z;
		    newGrid[x][y][1] = adj[at][1] + Math.floor( Math.random()*9 ) - 4;
		    newGrid[x][y][2] = adj[at][2] + Math.floor( Math.random()*9 ) - 4;
		} else {
		    red = s_z - 1;
		}
	    }
	}
    }
    newGrid[x][y][0] = red;

    if ( newGrid[x][y][1] < 0 ) {
	newGrid[x][y][1] = 0;
    }
    if ( newGrid[x][y][1] > 255 ) {
	newGrid[x][y][1] = 255;
    }
    if ( newGrid[x][y][2] < 0 ) {
	newGrid[x][y][2] = 0;
    }
    if ( newGrid[x][y][2] > 255 ) {
	newGrid[x][y][2] = 255;
    }
}

function tickRiseDrop( x, y, oldGrid, newGrid ) {
    
    var adj = getAdjacent( x, y, oldGrid );

    var avg = getAverage( adj );

    var cap = 200;
    var drop = 20;

    for ( var i=0; i<3; i++ ) {
	var val = avg[i] + Math.floor( Math.random() * 10 ) - 3;
	if ( val > cap ) {
	    if ( Math.random() > 0.9 ) {
		val = drop;
	    }
	}
	newGrid[x][y][i] = val;
    }
}

//Variation on Conway's Game of life, with different survival/creation
function tickConway2( x, y, oldGrid, newGrid ) {

    var isLive = oldGrid[x][y][0] == 0;

    var adj = getFullAdjacent( x, y, oldGrid );
    var adjL = adj.length;
    
    var onCount = 0;
    for ( var i=0; i<adjL; i++ ) {
	if ( adj[i][0] == 0 ) {
	    onCount++;
	}
    }

    if ( onCount == 1 || onCount == 3 || onCount == 5 || onCount == 7 ) {
	newGrid[x][y][0] = 0;
	newGrid[x][y][1] = 0;
	newGrid[x][y][2] = 0;
	/*
    } else if ( isLive && onCount == 4 ) {
	newGrid[x][y][0] = 0;
	newGrid[x][y][1] = 0;
	newGrid[x][y][2] = 0;
	*/
    } else {
	newGrid[x][y][0] = 255;
	newGrid[x][y][1] = 255;
	newGrid[x][y][2] = 255;
    }
}

function tickConway( x, y, oldGrid, newGrid ) {

    var isLive = oldGrid[x][y][0] == 0;

    var adj = getFullAdjacent( x, y, oldGrid );
    var adjL = adj.length;
    
    var onCount = 0;
    for ( var i=0; i<adjL; i++ ) {
	if ( adj[i][0] == 0 ) {
	    onCount++;
	}
    }

    if ( onCount == 3 ) {
	newGrid[x][y][0] = 0;
	newGrid[x][y][1] = 0;
	newGrid[x][y][2] = 0;
    } else if ( isLive && ( onCount == 2 ) ) {
	newGrid[x][y][0] = 0;
	newGrid[x][y][1] = 0;
	newGrid[x][y][2] = 0;
    } else {
	newGrid[x][y][0] = 255;
	newGrid[x][y][1] = 255;
	newGrid[x][y][2] = 255;
    }
}

function tickGrouping( x, y, oldGrid, newGrid ) { 
    var adj = getAdjacent( x, y, oldGrid );
    var adjL = adj.length;

    var myCol = oldGrid[x][y];
    var selCol;

    for ( var i=0; i<adjL; i++ ) {
	for ( var j=i+1; j<adjL; j++ ) {
	    if ( colorEquals( adj[i], adj[j] ) ) {
		selCol = adj[i];
	    }
	}
    }

    if ( typeof selCol == 'undefined' ) {
	var ch = Math.floor( Math.random() * adjL );
	selCol = adj[ch];
    }

    if ( Math.random() > 0.5 ) {
	selCol = myCol;
    }

    for ( var i=0; i<3; i++ ) {
	newGrid[x][y][i] = selCol[i];
    }
}

function tickPoles( x, y, oldGrid, newGrid ) {
    
    /*
    if ( Math.random() < 0.3 ) {
	for ( var i=0; i<3; i++ ) {
	    newGrid[x][y][i] = Math.floor( Math.random() * 255 );
	    return;
	}
	}*/
    
    var adj = getAdjacent( x, y, oldGrid );
    var adjL = adj.length;

    var bestCell = oldGrid[x][y];
    var bestVal = grayVal( bestCell );
    for ( var i=0; i<adjL; i++ ) {
	var val = grayVal( adj[i] );
	if ( val > bestVal ) {
	    bestVal = val;
	    bestCell = adj[i];
	}
    }

    var myCell = oldGrid[x][y];
    for ( var i=0; i<3; i++ ) {
	if ( bestCell != myCell ) {
	    var tar = bestCell[i]-1;
	    newGrid[x][y][i] = ( myCell[i] + tar )/2;
	}
    }
}

//Pick a random adjacent cell to mimic or
//stay the same
function tickRandAdj2( x, y, oldGrid, newGrid ) {

    if ( Math.random() > 0.5 ) {

	var adj = getFullAdjacent( x, y, oldGrid );
	var adjL = adj.length;
	var ch = Math.floor( Math.random() * adjL );
	
	for ( var i=0; i<3; i++ ) {
	    newGrid[x][y][i] = adj[ch][i];
	}
    } else {
	for ( var i=0; i<3; i++ ) {
	    newGrid[x][y][i] = oldGrid[x][y][i];
	}
    }
}

//Pick a random adjacent cell to mimic
function tickRandAdj( x, y, oldGrid, newGrid ) {

    var adj = getAdjacent( x, y, oldGrid );
    var adjL = adj.length;
    var ch = Math.floor( Math.random() * adjL );

    for ( var i=0; i<3; i++ ) {
	newGrid[x][y][i] = adj[ch][i];
    }
}

function tickAdjDif( x, y, oldGrid, newGrid ) {
    
    //var adj = getAdjacent( x, y, oldGrid );
    var adj = getFullAdjacent( x, y, oldGrid );
    var adjL = adj.length;
    var adjDif = getAdjDifMag( oldGrid[x][y], adj );

    var targetDif = 200;

    var offDif = targetDif - adjDif;

    var flag;
    if ( Math.abs( offDif ) < 100 ) {
	flag = Math.random() < 0.5;
    } else {
	flag = offDif > 0;
    }

    if ( flag ) {
	//Increase chaos
	for ( var i=0; i<3; i++ ) {
	    var sc = 80;
	    var rJ = Math.random() * sc;
	    newGrid[x][y][i] = Math.round( oldGrid[x][y][i] + rJ - sc/2 );
	}

    } else {
	
	var avg = getAverage( adj );
	for ( var i=0; i<3; i++ ) {
	    newGrid[x][y][i] = avg[i];
	}
    }
}

//Each color is average from those around it
function tickAverage( x, y, oldGrid, newGrid ) {

    var adj = getAdjacent( x, y, oldGrid );
    var avg = getAverage( adj );

    for ( var i=0; i<3; i++ ) {
	newGrid[x][y][i] = Math.floor( avg[i] );
    }
}

//Each color is drawn from above
function tickDrawDown( x, y, oldGrid, newGrid ) {
    var fromY = (y-1+cHeight)%cHeight;
    for ( var i=0; i<3; i++ ) {
	newGrid[x][y][i] = oldGrid[x][fromY][i];
    }
}

//Each color is randomly and uniformly chosen from 0-255
function tickFullRand( x, y, oldGrid, newGrid ) {
    for ( var i=0; i<3; i++ ) {
	newGrid[x][y][i] = Math.floor( Math.random() * 255 );
    }
}

//Filled with 0 and 255. Favor 255 over 0
function startBinary( x, y, grid ) {
    var val;
    if ( Math.random() > 0.87 ) {
	val = 0;
    } else {
	val = 255;
    }
    grid[x][y][0] = val;
    grid[x][y][1] = val;
    grid[x][y][2] = val;
}

//Random except for red, which is 0
function startGB( x, y, grid ) {
    grid[x][y][0] = 0;
    grid[x][y][1] = 128;
    grid[x][y][2] = 128;
}

function startGray( x, y, grid ) {
    grid[x][y][0] = 128;
    grid[x][y][1] = 128;
    grid[x][y][2] = 128;
}

//Random except for red, which is 0
function startLowRedRand( x, y, grid ) {
    var green = Math.floor( Math.random() * 255 );
    var blue = Math.floor( Math.random() * 255 );
    var red = Math.floor( Math.random() * 16 );
    grid[x][y][0] = red;
    grid[x][y][1] = green;
    grid[x][y][2] = blue;
}

//Random except for red, which is 0
function startGBRand( x, y, grid ) {
    var green = Math.floor( Math.random() * 255 );
    var blue = Math.floor( Math.random() * 255 );
    grid[x][y][0] = 0;
    grid[x][y][1] = green;
    grid[x][y][2] = blue;
}

//Each color is randomly and uniformly chosen from 0-255
function startFullRand( x, y, grid ) {
    var red = Math.floor( Math.random() * 255 );
    var green = Math.floor( Math.random() * 255 );
    var blue = Math.floor( Math.random() * 255 );
    grid[x][y][0] = red;
    grid[x][y][1] = green;
    grid[x][y][2] = blue;
}

function initDisplay( initF, scale ) {

    var pix = imgd.data;
    var grid = toGrid( pix, cWidth, cHeight, scale );

    for ( var i=0; i<cWidth; i++ ) {
	for ( var j=0; j<cHeight; j++ ) {
	    //Raise alpha from 0
	    grid[i][j][3] = 255;

	    initF( i, j, grid );
	}
    }

    toPixList( grid, pix, scale );
    context.putImageData( imgd, 0, 0 );
    return grid;
}

function canvasSetup( scale ) {
    var canvas = document.createElement( "canvas" );
    canvas.width = cWidth*scale;
    canvas.height = cHeight*scale;
    document.getElementById( "emergentCanvas" ).appendChild( canvas );
    return canvas.getContext('2d');
}

//Turns 1D data to 2D data
//Slows everything down, but easier to manipulate
//Data is returned a 3D array
//[x][y][R/B/G/A]
function toGrid( pix, w, h, scale ) {
    
    var grid = new Array();

    for ( var x=0; x<w; x++ ) {
	var col = new Array();
	grid.push( col );
	for ( var y=0; y<h; y++ ) {
	    var pt = new Array();
	    col.push( pt );

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
	//console.log( x + " | " + y );
	for ( var j=0; j<4; j++ ) {
	    pix[i+j] = grid[x][y][j];
	}
    }

    return pix;
}

function cloneGrid( grid ) {

    var w = grid.length;
    var h = grid[0].length;

    var newGrid = new Array();
    for ( var x=0; x<w; x++ ) {

    	var col = new Array();
    	newGrid.push( col );

    	for ( var y=0; y<h; y++ ) {

    	    var pt = new Array();
    	    col.push( pt );
    	    newGrid[x][y][0] = grid[x][y][0];
    	    newGrid[x][y][1] = grid[x][y][1];
    	    newGrid[x][y][2] = grid[x][y][2];
    	    newGrid[x][y][3] = grid[x][y][3];	    
    	}
    }
    return newGrid;
}

function colorEquals( c1, c2 ) {
    return ( c1[0]==c2[0] ) && 
	( c1[1]==c2[1] ) &&
	( c1[2]==c2[2] );

    //Ignore alpha
}

function getAdjDifMag( cell, oList ) {
    
    var difList = getAdjDif( cell, oList );
    var sum = 0;
    for ( var i=0; i<difList.length; i++ ) {
	sum += difList[i];
    }
    return sum;
}

//Given a cell and a list of cell to compare
//return list of average difference in each color
function getAdjDif( cell, oList ) {
    
    var difList = new Array();
    var oL = oList.length;
    for ( var i=0; i<3; i++ ) {
	difList[i] = 0;

	for ( var j=0; j<oL; j++ ) {
	    var sub = cell[i] - oList[j][i];
	    difList[i] += Math.abs( sub );
	}
	difList[i] /= oL;
    }

    return difList;
}

//Returns a list the adjacent cells as their 
//pixel lists (R/G/B/A array)
function getAdjacent( x, y, grid ) {

    var w = grid.length;
    var h = grid[0].length;
    
    var adj = new Array();
    
    adj.push( grid[ (x+1)%w ][ y ] );
    adj.push( grid[ (x+w-1)%w ][ y ] );
    adj.push( grid[ x ][ (y+1)%h ] );
    adj.push( grid[ x ][ (y+h-1)%h ] );

    return adj;
}

//Orthagonal AND adjacent
function getFullAdjacent( x, y, grid ) {

    var w = grid.length;
    var h = grid[0].length;
    
    var adj = new Array();
    
    adj.push( grid[ (x+1)%w ][ y ] );
    adj.push( grid[ (x+w-1)%w ][ y ] );
    adj.push( grid[ x ][ (y+1)%h ] );
    adj.push( grid[ x ][ (y+h-1)%h ] );

    adj.push( grid[ (x+1)%w ][ (y+1)%h ] );
    adj.push( grid[ (x+1)%w ][ (y+h-1)%h ] );
    adj.push( grid[ (x+w-1)%w ][ (y+1)%h ] );
    adj.push( grid[ (x+w-1)%w ][ (y+h-1)%h ] );


    return adj;
}

function getAverage( cells ) {

    var cL = cells.length;
    var aList = new Array();
    for ( var i=0; i<3; i++ ) {

	var avg = 0;
	for ( var j=0; j<cL; j++ ) {
	    avg += cells[j][i];
	}
	avg /= cL;

	aList.push( avg );
    }
    return aList;
}

function grayVal( cell ) {
    var val = cell[0];
    val += cell[1];
    val += cell[2];
    return val/3;
}
