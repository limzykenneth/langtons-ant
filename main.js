var x, y, direction, rowWidth, rowHeight, boxes = [], slider;
function setup(){
	frameRate(120);
	background(255);
	
	direction = "UP";
	rowWidth = 100;
	rowHeight = 70;
	x = rowWidth/2;
	y = rowHeight/2;

	var w = rowWidth*10 + 10, h = rowHeight*10 + 10;

	canvas = createCanvas(w, h);
	canvas.addClass('sketch');

	rectMode(CENTER);
	stroke(0);
	fill(255);
	for (var i=0; i<rowHeight; i++){
		for (var j=0; j<rowWidth; j++){
			rect(10 + 10*j, 10 + 10*i, 10, 10);
			boxes[j + i*rowWidth] = "WHITE";
		}
	}
	noLoop();

	$("#shuffle").click(function(){
		for (var i=0; i<20; i++){
			boxes[floor(random(rowWidth*rowHeight))] = "BLACK";
		}
		for (var i=0; i<rowHeight; i++){
			for (var j=0; j<rowWidth; j++){
				if (boxes[j + i*rowWidth] == "WHITE"){
					fill(255);
				}else{
					fill(0);
				}
				rect(10 + 10*j, 10 + 10*i, 10, 10);
			}
		}
	});

	$("#reset").click(function(){
		for (var i=0; i<rowHeight; i++){
			for (var j=0; j<rowWidth; j++){
				rect(10 + 10*j, 10 + 10*i, 10, 10);
				boxes[j + i*rowWidth] = "WHITE";
			}
		}
		x = rowWidth/2;
		y = rowHeight/2;
		redraw();
	});

	var controls = select("#controls");
	controls.style("width", w + "px");
}

// The rule is: white square -> one step to the right
//              black square -> one step to the left 
// Invert color each time.

var currentPixel;
function draw(){
	var b;
	currentPixel = boxes[x + y*rowWidth];
	if (direction == "UP"){
		if (currentPixel == "WHITE"){
			boxes[x + y*rowWidth] = "BLACK";
			x+=1;
			direction = "RIGHT";
		}else{
			boxes[x + y*rowWidth] = "WHITE";
			x-=1;
			direction = "LEFT";
		}
	}else if (direction == "RIGHT"){
		if (currentPixel == "WHITE"){
			boxes[x + y*rowWidth] = "BLACK";
			y+=1;
			direction = "DOWN";
		}else{
			boxes[x + y*rowWidth] = "WHITE";
			y-=1;
			direction = "UP";
		}
	}else if (direction == "DOWN"){
		if (currentPixel == "WHITE"){
			boxes[x + y*rowWidth] = "BLACK";
			x-=1;
			direction = "LEFT";
		}else{
			boxes[x + y*rowWidth] = "WHITE";
			x+=1;
			direction = "RIGHT";
		}
	}else if (direction == "LEFT"){
		if (currentPixel == "WHITE"){
			boxes[x + y*rowWidth] = "BLACK";
			y-=1;
			direction = "UP";
		}else{
			boxes[x + y*rowWidth] = "WHITE";
			y+=1;
			direction = "DOWN";
		}
	}


	if (boxes[x + y*rowWidth] == "WHITE"){
		fill(0);
	}else{
		fill(255);
	}
	rect(10 + 10*x, 10 + 10*y, 10, 10);

	if (x < 0 || y < 0 || x > rowWidth || y > rowHeight){
		noLoop();
		$("#message").text("Out of bounds!");
	}
	
	$(".sketch").click(function(){
		loop();
	});
}

function keyPressed(){
	if (keyCode === ENTER){
		loop();
	}
}

$(document).ready(function() {
	var description = 'From [Wikipedia] (https://en.wikipedia.org/wiki/Langton%27s_ant): &#8220;Langton&#8217;s ant is a two-dimensional Turing machine with a very simple set of rules but complex emergent behavior. It was invented by Chris Langton in 1986 and runs on a square lattice of black and white cells.&#8221; I recommend [this video] (https://www.youtube.com/watch?v=NWBToaXK5T0) by Numberphile to explain it better. --- Rules are simple: 1. At a white square, turn 90&#176; right, flip the color of the square, move forward one unit. | 2. At a black square, turn 90&#176; left, flip the color of the square, move forward one unit |';
	var result = smark.generate(description).html;

	$("#description").html(result);
});