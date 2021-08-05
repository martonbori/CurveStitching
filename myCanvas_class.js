class myCanvas {
	constructor(canvasElement,edges,pointsPerEdges) {
		this.canvas=canvasElement;
		this.ctx=canvasElement.getContext('2d');		

		this.lines=[];
		this.polygonN=edges;
		this.vertices=[];
		this.points=[];	
		for(var i=0;i<edges;i++) 	
			this.points.push([]);
		this.pointsPerEdges=pointsPerEdges;
		this.pointR=3;
		this.edgeLength=300;
		this.autoSize=true;
		this.lineCntFromPoint=1;
		this.lineLengthRatio=1;

		this.numbersVisible = false;
		
		this.drawState = {
			pen : false,
			mousePos : new Pos(0,0),
			startPoint : null,
			endPoint : null,
			penDown: function() {
				this.pen=true;
			},
			penUp: function() {
				this.pen=false;
			}
		};
		this.drawState.penUp();
		this.Animator = {
			lineToken : 0,
			startTime : null,
			func : null,
			speed : 0.05,
			currPos : null,
			currTime : null,
			active : false,
			reset : function() {
				this.func = null;
				this.lineToken=0;
				this.startTime=null;
				this.speed=0.05;
				this.active = false;
			},
			isActive : function() {
				return this.active;
			},
			started : function() {
				return this.func!=null;
			},
			requestFrame : function() {
				if(this.active) window.requestAnimationFrame(this.func);
			},
			start : function(func) {
				this.active = true;
				this.func = func;
				this.requestFrame();
			},
			pause : function() {
			        this.active = false;
			}
		};
		
		this.init();
	}
	initDraw() {
		var canvasWidth=this.canvas.clientWidth, canvasHeight=this.canvas.clientHeight, context=this.ctx;
		context.clearRect(0,0,this.canvas.clientWidth,this.canvas.clientHeight);

		context.beginPath();
		for(var i=0;i<this.polygonN;i++) {	
			console.log("("+this.vertices[i].x+","+this.vertices[i].y+")");			
			context.moveTo(this.vertices[i].x,this.vertices[i].y);
			context.lineTo(this.vertices[i+1].x,this.vertices[i+1].y);
		}
		context.closePath();
		context.stroke();		
		context.beginPath();
		for(var i=0;i<this.polygonN;i++) {
			var angle = this.getEdgeAngle(new Line(this.vertices[i], ((i==this.polygonN-1) ? this.vertices[0] : this.vertices[i+1])) );
			for(var j=0;j<this.pointsPerEdges;j++) {
				var pointX=this.points[i][j].pos.x, pointY=this.points[i][j].pos.y;
				context.moveTo(pointX+Point.R,pointY);
				//context.arc(pointX,pointY,Point.R,0,2*Math.PI,true);
				if(this.numbersVisible) {
					context.save();
					context.translate(pointX,pointY);
					context.rotate(angle);				
					context.fillText(j+1,-2.5,20,8);                	
					context.restore();
				}				
			}
		}
		context.stroke();
	}
	drawNumber(context, edge, point) {
	}
	fillPattern(x,y) {
		var temp = this.ctx.fillStyle;
		this.ctx.fillStyle = "rgba(0,255,0,1)";
		var green = false;
		var line = false;
		var w = this.getWidth();
		var h = this.getHeight();
		var imgData = this.ctx.getImageData(0,0,w,h);
		for(var col=5;col<w-5;col++) {
			for (var row = 5; row < h-5; row++) {
				var px = (row*(w*4))+(col*4);
				if (imgData.data[px+3] > 100 && imgData.data[px] == 0 && imgData.data[px+1] == 0 && imgData.data[px+2] == 0) {
					//console.log("row:"+row + " col:"+col);

					if(!line) {
						green = !green;
						if (green)
							this.ctx.fillStyle = "rgba(0,255,0,1)";
						else
							this.ctx.fillStyle = "rgba(255,0,0,0)";
						line = true;
					}
				} else {
					this.ctx.fillRect(col, row, 1, 1);
					line = false;
				}
			}
		}
		this.ctx.fillStyle = temp;
	}
	getEdgeAngle(edge) {
		var deltaX=edge.end.x-edge.start.x;
		var deltaY=edge.end.y-edge.start.y;
		var angle = deltaX==0 ? Math.PI/2 : Math.atan(deltaY/deltaX);
		if (deltaX<0 || (deltaX==0 && deltaY<0)) angle+=Math.PI;
		return angle;
	}
	
	init() {
		var canvasWidth=this.canvas.clientWidth, canvasHeight=this.canvas.clientHeight;
		var q = this.pointsPerEdges+1,r=Point.R;
		var n = this.polygonN; 
		var R,a,T;
		if (this.autoSize) {	
			R = (canvasHeight-50)/2;
			T = Math.pow(R,2)*Math.PI;
			a = R*2*Math.sin(Math.PI/n);
		} else {
			a = this.edgeLength;
			R = a/(2*Math.sin((Math.PI/n)));
			T = Math.pow(R,2)*Math.PI;
		}		
		var alpha = 180*(n-2)/n, deltaPhi=360/n*(-1), phi=0;
		var centerX=canvasWidth/2, centerY=canvasHeight/2;
		var originPos=new Pos(centerX,centerY);
		
		var originY=centerY+R*Math.sin((Math.PI/180)*alpha/2), originX=centerX-R*Math.cos((Math.PI/180)*alpha/2);
                originPos=new Pos(originX,originY);            
		this.vertices.push(originPos);

		var translateSumX=originPos.x,translateSumY=originPos.y;
		for(var i=0;i<n;i++) {
			for(var j=1;j<q;j++) {
				var pointX=(a*j)/q, pointY=0;
				var originalX=translateSumX+(pointX*Math.cos((Math.PI/180)*phi));
				var originalY=translateSumY+(pointX*Math.sin((Math.PI/180)*phi));
				var pointPos=new Pos(originalX,originalY);
				this.addPoint(i,j-1,pointPos);				
			}
			translateSumX+=a*Math.cos((Math.PI/180)*phi),translateSumY+=a*Math.sin((Math.PI/180)*phi);
			this.vertices.push(new Pos(translateSumX,translateSumY));
			phi+=deltaPhi;
		}
		this.initDraw();
	}
	pointOf(x,y) {
		var point=null;
		this.points.forEach(function(points2) {
			points2.forEach(function(p) {
				if(p.containsPos(x,y)) 
					point=p;
			});
		});
		return point;
	}

	drawLines() {
		var context=this.ctx;
		for(var i=0;i<this.lines.length;i++) {
			var line=this.lines[i];
			context.beginPath();
			context.moveTo(line.start.pos.x,line.start.pos.y);
			if(this.lineLengthRatio==1)
				context.lineTo(line.end.pos.x,line.end.pos.y);
			else {
				var deltaX = line.end.pos.x-line.start.pos.x, deltaY=line.end.pos.y-line.start.pos.y;
				var endX = line.start.pos.x + this.lineLengthRatio*deltaX, endY = line.start.pos.y + this.lineLengthRatio*deltaY;
				context.lineTo(endX,endY);
			}
			context.stroke();
		}

	}
	animateByLines(timestamp) {
		var anim=this.Animator;
		var lines = this.lines, context=this.ctx;
		var startX=lines[anim.lineToken].start.pos.x, startY=lines[anim.lineToken].start.pos.y, endX=lines[anim.lineToken].end.pos.x, endY=lines[anim.lineToken].end.pos.y;
		if(anim.startTime==null) {            
			anim.currPos=new Pos(startX,startY);
			anim.startTime=timestamp;
		}
                var currX = anim.currPos.x, currY=anim.currPos.y;
		var tgalpha= (endX!=currX) ? ((endY-currY)/(endX-currX)) : 1;
		var step=(timestamp-anim.startTime)*anim.speed;
		
		context.beginPath();	
		context.moveTo(currX,currY);
		
		if(endX>startX) currX=Math.min(currX+step,endX);	
		else currX=Math.max(currX-step,endX);	
		
		if(endY>startY) currY=Math.min(currY+(Math.abs(step*tgalpha)),endY);
		else currY=Math.max(currY-(Math.abs(step*tgalpha)),endY);
			
		
		context.lineTo(currX,currY);
		anim.currPos=new Pos(currX,currY);
		context.stroke();
		if(currX!=endX || currY!=endY) anim.requestFrame();
		else {                                
			anim.lineToken++;
			anim.startTime=null;
			if(anim.lineToken<lines.length) anim.requestFrame(); 
			else 
				anim.reset();
		}	
	}
	animateAllLines(timestamp) {		
		var step=0.01;
		var anim=this.Animator;
		var context=this.ctx;
		if(anim.startTime==null) {            
			anim.startTime=timestamp;
			anim.currTime=anim.startTime;
			anim.currPos=0;
		}
		if((timestamp-anim.currTime)>(1/anim.speed)) {
			console.log("animate");
			this.clear();
			anim.currTime=timestamp;
			anim.currPos+=step;						
			for(var i=0;i<this.lines.length;i++) {
				var line=this.lines[i];
				context.beginPath();
				context.moveTo(line.start.pos.x,line.start.pos.y);
				var deltaX = line.end.pos.x-line.start.pos.x, deltaY=line.end.pos.y-line.start.pos.y;
				var endX = line.start.pos.x + anim.currPos*deltaX, endY = line.start.pos.y + anim.currPos*deltaY;
				context.lineTo(endX,endY);
				context.stroke();
			}		

		}
		if(anim.currPos<this.lineLengthRatio) anim.requestFrame();
		else anim.reset();
	}	
	
	validPoint(edge,num) {
		return edge<this.polygonN && edge>-1 && num>-1 && num<this.pointsPerEdges;
	}
	
	setPattern(pattern) {
		this.lines=[];
		var eVar = new Variable('e',0);
		var nVar = new Variable('x',0);
		var lVar = new Variable('l',0);
		var vars=[eVar,nVar,lVar];
		for(var e=0;e<this.points.length;e++) {
			for(var n=0;n<this.points[e].length;n++) {
				for(var l=1;l<(parseInt(this.lineCntFromPoint)+1);l++) {
					var p = this.points[e][n];
					eVar.setValue(p.edge);
					nVar.setValue(p.num+1);
					lVar.setValue(l);
					var endPointEdge=parseInt(pattern.endPointEdge(vars))%this.polygonN;
					var endPointNum=parseInt(pattern.endPointNum(vars))-1;
					if(this.validPoint(endPointEdge,endPointNum)) this.addLine(p,this.points[endPointEdge][endPointNum]);				
					
				}
				
			}
			
		}	
	}
	
	drawPattern() {
		this.drawLines();

	}
	animatePattern(speed=0.05) {
		this.Animator.speed=speed;
		this.Animator.start(this.animateAllLines.bind(this));
	}
	draw() {
		var context=this.ctx, drawState=this.drawState;
		context.clearRect(0,0,this.canvas.clientWidth,this.canvas.clientHeight)
		this.init();
		this.drawLines();
		if(drawState.pen) {
			context.beginPath();
			context.moveTo(drawState.startPoint.pos.x,drawState.startPoint.pos.y);
			context.lineTo(drawState.mousePos.x,drawState.mousePos.y);
			context.stroke();
		}
	}
	
	mouseClickListener(event) {
		var drawState= this.drawState;
		var point = this.pointOf(event.offsetX,event.offsetY);
		if (point!=null) {					
			if (drawState.pen) {
				drawState.endPoint=point;
				this.addLine(drawState.startPoint,drawState.endPoint);
				drawState.penUp();
			} else {
				drawState.startPoint=point;
				drawState.penDown();	
			}
			window.requestAnimationFrame(this.draw.bind(this));
		}
	}
	mouseMoveListener(event) {
		this.drawState.mousePos= new Pos(event.offsetX,event.offsetY);
		console.info(this.drawState.mousePos.x+"|"+this.drawState.mousePos.y);
		if(this.drawState.pen) window.setTimeout(this.draw.bind(this),10);		
	}
	
	sandBoxMode(mode) {
		if(mode) {
			this.canvas.addEventListener("mousedown", this.mouseClickListener.bind(this));
			
			this.canvas.addEventListener("mousemove", this.mouseMoveListener.bind(this));	
		}
		this.fillPattern(0,0);

	}
	clear() {
		this.initDraw();	
	}
	addLine(start,end) {		
		this.lines.push(new Line(start,end));
	}
	addPoint(edge,num,pos) {		
		this.points[edge].push(new Point(edge,num,pos));
	}
	setPointSize(size) {
		this.pointR=size;
	}
	setAutoSize(autoSize) {
		this.autoSize=autoSize;
		this.resetCanvas();
	}
	setSize(size) {
		this.edgeLength=size;
		this.resetCanvas();
	}
	showNumbers(value) {
		this.numbersVisible=value;
	}
	setLinesFromPoint(lineCount) {
		this.lineCntFromPoint=lineCount;
	}
	setAnimationSpeed(speed) {
		this.Animator.speed=speed;
	}
	setLineLength(ratio) {
		this.lineLengthRatio=ratio;
	}
	getWidth() {
		return this.canvas.clientWidth;
	}
	getHeight() {
		return this.canvas.clientHeight;
	}
	resetCanvas(polygonN=this.polygonN,pointsPerEdges=this.pointsPerEdges) {
                this.polygonN=polygonN;
		this.pointsPerEdges=pointsPerEdges;
		this.lines=[];
		this.vertices=[];
		this.points=[];
		for(var i=0;i<this.polygonN;i++) this.points[i]=[]; 		
		this.init();
	}
}
