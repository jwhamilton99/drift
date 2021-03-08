// const width = 600;
// const height = 400;

var points = [];

var gridSize = 30;

var colors = [];

var last;

var t = 0;
var increment = 0.1;

var magnetismSlider;
var showVisualization;
var speedSlider;
var framerateOutput;
var newColorButton;

function setup() {
	createCanvas(gridSize*40,gridSize*25);
	frameRate(100);
	
	newColor();
	
	magnetismSlider = createSlider(0,100,100);
	speedSlider = createSlider(1,20,3);
	showVisualization = createRadio();
	showVisualization.option("none",0);
	for(var i = 0; i < colors.length; i++) {
		showVisualization.option(i+1,i+1);
	}
	showVisualization.selected("none");
	framerateOutput = createP("0");
	newColorButton = createButton("new colors");
	newColorButton.mousePressed(newColor);
}

function newColor() {
	colors = [color(random(100,255),0,0),color(0,random(100,255),0),color(0,0,random(100,255))];
}

function draw() {
	background(0);
	var xoff = 0;
	for(var x = -gridSize; x <= width+gridSize; x+=gridSize) {			
		var yoff = 0;
		for(var y = -gridSize; y <= height+gridSize; y+=gridSize) {
			stroke(255);
			var angle = (noise(xoff,yoff,t)*TWO_PI);
			var magnitude = max((noise(xoff+5,yoff+5,t)*gridSize*2.5)-(gridSize*0.5),0)*(magnetismSlider.value()/100);
			if(magnitude > 0.1) {
				var r = 0;
				var g = 0;
				var b = 0;
				for(var i = 0; i < colors.length; i++) {
					var colorMap = 1-(noise(xoff+(5*(i+2)),yoff+(5*(i+2)),t));
					if(showVisualization.value() != 0) {
						if(i+1 == showVisualization.value()) {
							fill(colorMap*255);
							stroke(255);
							rect(x,y,gridSize,gridSize);
						}
					}
					r+=colors[i].levels[0]*colorMap;
					g+=colors[i].levels[1]*colorMap;
					b+=colors[i].levels[2]*colorMap;
				}
				push();
				var v = p5.Vector.fromAngle(angle);
			
				translate(x,y);
			
				rotate(v.heading());
				var w = map(magnitude*2, 0, gridSize*1.5, 0, 4);
				strokeWeight(w);
				stroke(r,g,b,75);
				line(0,0,magnitude,magnitude);
				noStroke();
				fill(r,g,b);
				var r = map(magnitude*2, 0, gridSize*1.5, 0, 5);
				ellipse(magnitude, magnitude, r);
			
				pop();
			}
			yoff+=increment;
		}
		xoff+=increment;
	}
	t+=speedSlider.value()/1000;
	framerateOutput.html(floor(frameRate()));
}