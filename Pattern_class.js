class Pattern {
	constructor(edgePatternFunc, pointPatternFunc) {
		this.edgePattern=edgePatternFunc;
		this.pointPattern=pointPatternFunc;		                             	
	}
	endPointEdge(vars) {
		return this.edgePattern(vars);
	}
	endPointNum(vars) {
		return this.pointPattern(vars);
	}

	setEdgePatternByExpr(expr) {
		this.edgePattern=Pattern.getFuncByExpr(expr);
	}

	setPointPatternByExpr(expr) {
		this.pointPattern=Pattern.getFuncByExpr(expr);
	}
}
