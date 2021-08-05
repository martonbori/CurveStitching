class Line {
	constructor(start, end) {
		this.start=start;
		this.end=end;	
	}

	isOnLine(pos) {
		let m = (this.start.pos.y - this.end.pos.y) / (this.start.pos.x - this.end.pos.x);
		let b1 = this.start.pos.y - (m * this.start.pos.x);
		let b2 = this.end.pos.y - (m * this.end.pos.x);
		let b = (b1+b2)/2;
		return (pos.y <= Math.floor((m * pos.x) +b)+2) && (pos.y >= Math.floor((m * pos.x) +b)-2);
	}
}
