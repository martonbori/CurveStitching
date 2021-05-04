polygonN = document.getElementById("polygonN");
polygonSize = document.getElementById("polygonSize");
pointCount = document.getElementById("pointCount");
animateBtn = document.getElementById("animateBtn");
drawBtn = document.getElementById("drawBtn");
edgePatternTb = document.getElementById("edgePatternTb");
numPatternTb = document.getElementById("numPatternTb");
patternSubmit = document.getElementById("patternSubmit");
sandBoxChk = document.getElementById("sandBoxChk");
autoSizeChk = document.getElementById("autoSizeChk");
multipleLinesFromPointChk = document.getElementById("multipleLinesFromPointChk");
multipleLinesLabel = document.getElementById("multipleLinesLabel");
lineCntFromPoint = document.getElementById("lineCntFromPoint");
animSpeed = document.getElementById("animationSpeed");
lineLength = document.getElementById("lineLength");
svgLink=document.getElementById("svgDownloadLink");
canvas = document.getElementById('canvas');
showNumbering = document.getElementById('showNumbering'); 
numbering = document.getElementById('numbering'); 


c=new myCanvas(canvas, polygonN.value,parseInt(pointCount.value));
edges = new Const('n',c.edges);
consts = [edges];
pattern=null;
changePattern();
c.setPattern(pattern);
drawCanvas();

function animateCanvas() {
	c.clear();
	c.animatePattern(parseFloat(animSpeed.value));
}

function drawCanvas() {
	c.clear();
	c.drawPattern();
}
function changePattern() {
	pattern = new Pattern (
		function(variables) { return Expression.eval(edgePatternTb.value,variables);},
		function(variables) { return Expression.eval(numPatternTb.value,variables);
	});
	c.setPattern(pattern);
	drawCanvas();
}
	
polygonN.addEventListener("input",function() {
	edges = new Const('n',polygonN.value);
	consts = [edges];
	Expression.setConsts(consts);
	c.resetCanvas(polygonN.value,c.pointsPerEdges);
	c.setPattern(pattern);
	drawCanvas();
});
svgLink.addEventListener("click", function() {
	svgLink.download=prompt('Filename?', 'pattern.svg');
	svgLink.href='data:application/octet-stream;utf8,'+encodeURIComponent(Canvas2Svg.getSvg(c));
});
polygonSize.addEventListener("input",function() {
	c.setSize(polygonSize.value);
	c.setPattern(pattern);
	drawCanvas();
});
pointCount.addEventListener("input",function() {
	points=parseInt(pointCount.value);
	c.resetCanvas(c.polygonN,points);
	c.setPattern(pattern);
	drawCanvas();
});
animateBtn.addEventListener("click",animateCanvas);
drawBtn.addEventListener("click",drawCanvas);
animSpeed.addEventListener("input",function() {
	c.setAnimationSpeed(parseFloat(animSpeed.value));
});
lineLength.addEventListener("input",function() {
	c.setLineLength(parseFloat(lineLength.value)/100);
	drawCanvas();
});

edgePatternTb.addEventListener("change",changePattern);
numPatternTb.addEventListener("change",changePattern);
patternSubmit.addEventListener("click",changePattern);

sandBoxChk.addEventListener("change",function() {
		c.sandBoxMode(sandBoxChk.value);
});
multipleLinesFromPointChk.addEventListener("change",function() {
	if (multipleLinesFromPointChk.checked) {
		multipleLinesLabel.style.display = "block";
		c.setLinesFromPoint(lineCntFromPoint.value);
	} else {
		multipleLinesLabel.style.display = "none";
		c.setLinesFromPoint(1);
	}
	changePattern();
});
showNumbering.addEventListener("change",function() {
	c.showNumbers(showNumbering.checked);
	drawCanvas();
});

lineCntFromPoint.addEventListener("input",function() {
	c.setLinesFromPoint(lineCntFromPoint.value);
	changePattern();
});

autoSizeChk.addEventListener("change",function() {
	c.setAutoSize(autoSizeChk.checked);
	c.setPattern(pattern);
	drawCanvas();
});      