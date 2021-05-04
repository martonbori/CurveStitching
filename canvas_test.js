var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var logElement = document.getElementById('log');

class TransformationHistory {
	constructor() {
		this.history = new Array();
	}
	translate(x,y) {
		this.history.push(new Array("translate",x,y));
	}
	rotate(angle) {
		this.history.push(new Array("rotate",angle));
	}
}


var startX=0,startY=0,mouseX=0,mouseY=0,endX=0,endY=0;
var drawLine=false;
var arrayTest = [mouseX,mouseY]
start=null;
canvas.addEventListener("mousedown", function(event) {
	if (drawLine) {
		endX=event.offsetX;
		endY=event.offsetY;
		drawLine=false;
		window.requestAnimationFrame(animation);
	} else {
		startX=event.offsetX;
		startY=event.offsetY;
		start=null;
		drawLine=true;	
	}
	
	window.setTimeout(draw,10);
});
draw();
canvas.addEventListener("mousemove", function(event) {
	mouseX=event.offsetX;
	mouseY=event.offsetY;	
	logElement.textContent = mouseX+"|"+mouseY+ " \ / "+arrayTest[0]+"|"+arrayTest[1]; 
	window.setTimeout(draw,10);
});
function draw() {
	th=new TransformationHistory();
	th.translate(40,50);
	th.rotate((Math.PI/180)*55);
	th.translate(60,70);
	th.rotate((Math.PI/180)*75);
	th.translate(80,90);
	th.rotate((Math.PI/180)*95);
	
	th.history.forEach(function(t) {
		console.log(t[0]+" "+t[1]+" "+t[2]);
	});
		
	context.clearRect(0, 0, 500, 300);
	context.beginPath();
	context.moveTo(startX,startY);
	if(drawLine) context.lineTo(mouseX,mouseY);
	else context.lineTo(endX,endY);
	context.stroke();
}
function animation(timestamp) {
	if(!start) start=timestamp;
	progress=timestamp-start;
	tgalpha=(endY-startY)/(endX-startX)
	currX=startX+progress/10;
	currY=startY+(progress/10*tgalpha);
	context.clearRect(0, 0, 500, 300);
	context.beginPath();
	context.moveTo(startX,startY);
	context.lineTo(currX,currY);
	context.stroke();
	if(currX<endX)window.requestAnimationFrame(animation);		
}