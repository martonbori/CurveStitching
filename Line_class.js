class Line {
	constructor(start, end) {
		this.start=start;
		this.end=end;	
		this.m = (start.y - end.y) / (start.x - end.x);
		let b1 = start.y - (this.m * start.x);
		let b2 = end.y - (this.m * end.x);
		this.b = (b1+b2)/2;
		console.log("y = " + this.m +"x + " + this.b);
	}

	isOnLine(pos) {
		return pos.y === Math.floor((this.m * pos.x) +this.b);
	}
}
