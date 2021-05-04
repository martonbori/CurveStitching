var canvas = document.getElementById('canvas');

pattern=new Pattern(20,
	function(x){return x*9},
	function(x){return x});

c = new myCanvas(canvas, 12, 15);
c.setAutoSize(false);
c.setSize(100);
//c.animatePattern(pattern,10);
c.drawPattern(pattern);

c.sandBoxMode(true);	
