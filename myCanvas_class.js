class myCanvas {
	static canvas;
	static ctx;
	constructor(canvasElement) {
		myCanvas.canvas = canvasElement;
		myCanvas.ctx = canvasElement.getContext('2d');

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
		
	}
	static getCanvas() {
		return canvas;
	}
	static getContext() {
		return ctx;
	}
	getWidth() {
		return this.canvas.clientWidth;
	}
	getHeight() {
		return this.canvas.clientHeight;
	}
	setAnimationSpeed(speed) {
		this.Animator.speed=speed;
	}
}
