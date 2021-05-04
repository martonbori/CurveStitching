class Point {
	static R=3;
	constructor(edge,num,pos) {
		this.edge=edge;
		this.num=num;
		this.pos=pos;
	}
	containsPos(x,y) {
		return Math.pow(x-this.pos.x,2)+Math.pow(y-this.pos.y,2)<= (Math.pow(Point.R*2,2));
	}
	distanceFromPos(x,y) {
		if(this.containsPos(x,y)) return 0;
		else 
		return Math.sqrt(Math.pow(x-this.pos.x)+Math.pow(y-this.pos.y))-pointR;
	}
}
