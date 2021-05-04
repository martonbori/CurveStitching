//fs=require('fs');
class Canvas2SvgContext {
	constructor(width,height) {
		this.init(width,height);
	}
	init(width,height) {
		this.width=width;
		this.height=height;
		this.x=0;
		this.y=0;
		this.origX=0;
		this.origY=0;
		this.path=false;
		this.svg='';
	}
	moveTo(x,y) {
		console.log("move to");
		this.x=x+this.origX;
		this.y=y+this.origY;
		if(this.path) this.svg+='M'+x+this.origX+' '+y+this.origY+' ';
	}
	lineTo(x,y) {
		console.log("line to");
		if(this.path) this.svg+='L'+x+this.origX+' '+y+this.origY+' ';
		else this.svg+='<line x1="'+(this.x)+'" y1="'+(this.y)+'" x2="'+(x)+'" y2="'+(y)+'" style="stroke:rgb(0,0,0);stroke-width:1" />';
	}
	beginPath() {
		console.log("begin path");
/*		if(this.path) this.svg+='"/>'; 
		this.path=true;
		this.svg+='<path d="';*/
	}
/*	getOriginalPos(x,y) {

		var originalX=translateSumX+(pointX*Math.cos((Math.PI/180)*phi));
		var originalY=translateSumY+(pointX*Math.sin((Math.PI/180)*phi));
		
		var translateSumX=originPos.x,translateSumY=originPos.y;
		for(var i=0;i<n;i++) {
			for(var j=1;j<q;j++) {
				var pointX=(a*j)/q, pointY=0;
				var pointPos=new Pos(originalX,originalY);
				this.addPoint(i,j-1,pointPos);				
			}
			translateSumX+=a*Math.cos((Math.PI/180)*phi),translateSumY+=a*Math.sin((Math.PI/180)*phi);
			this.vertices.push(new Pos(translateSumX,translateSumY));
			phi+=deltaPhi;
		}

	}*/
	closePath() {
		console.log("close path");
/*		if(this.path) {
			this.svg+='Z"/>';
			this.path=false;
		}*/
	}
	translate(x,y) {
		console.log("translate");
/*		this.origX+=x;
		this.origY+=y;*/
	}
	stroke() {
		console.log("stroke");
	}
	getSvg(canvas) {
		var origContext=canvas.ctx;
		canvas.ctx=this;
		canvas.drawPattern();
		canvas.ctx=origContext;
		if(this.path) this.svg+='"/>';		
		return this.svg;
	}
}
class Canvas2Svg {
	static getSvg(canvas) {
		var svg='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" height="'+canvas.getHeight()+'" width="'+canvas.getWidth()+'">';
		svg+='<rect width="'+canvas.getWidth()+'" height="'+canvas.getHeight()+'" style="fill:none;stroke:none" />';
		var svgContext=new Canvas2SvgContext(canvas.getWidth(),canvas.getHeight());
		svg+=svgContext.getSvg(canvas);
		svg+='</svg>';
		return svg;
	}
}