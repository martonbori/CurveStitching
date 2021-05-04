class Variable {
	constructor(name,value=null) {
		this.name=name;
		this.value=value;
	}
	getName() {
		return this.name;
	}
	getValue() {
		return this.value;
	}
	setValue(value) {
		this.value=value;
	}
}
class Const {
	constructor(name,value) {
		this.name=name;
		this.value=value;
	}
	getName() {
		return this.name;
	}
	getValue() {
		return this.value;
	}
}

class Expression {
	static operators = [['+',0],['-',0],['*',1],['/',1],['%',1]];
	static consts = null;
	construct(canvas) {
		this.canvas=canvas;
	}
	static eval(expr,vars=null) {	
		var index = 0;
		if(index=Expression.findOperator(expr)) {
			switch (expr[index]) {
				case '+':
					return (Expression.eval(expr.substring(0,index),vars,consts)) + (Expression.eval(expr.substring(index+1,expr.length),vars,consts));
				case '-':
					return (Expression.eval(expr.substring(0,index),vars,consts)) - (Expression.eval(expr.substring(index+1),vars,consts));
				case '*':                
					return (Expression.eval(expr.substring(0,index),vars,consts)) * (Expression.eval(expr.substring(index+1),vars,consts));
				case '/':
					return (Expression.eval(expr.substring(0,index),vars,consts)) / (Expression.eval(expr.substring(index+1),vars,consts));
				case '%':
					return (Expression.eval(expr.substring(0,index),vars,consts)) % (Expression.eval(expr.substring(index+1),vars,consts));
				default :
					return null;
			}	
		} else {
			if(Expression.consts) {
				var constValue=null;
				Expression.consts.forEach(function(c,index) {
					if(expr==c.getName()) {
						constValue = c.getValue();
					}
				});
				if(constValue!=null) return constValue;
			}
			if(vars) {
				var varValue=null;
				vars.forEach(function(v,index) {
					if(expr==v.getName()) {
						varValue=v.getValue();
					}
				});	
				if(varValue!=null) return varValue;
			}
			if(!Expression.isOperator(expr)) {
				return parseInt(expr);
			}
			console.log("Érvénytelen karakter");
			return null;
		}
	}
	static isOperator(character) {
		var isOperator=false;
		for(var i=0;i<Expression.operators.length;i++) {
			if (Expression.operators[i].includes(character)) isOperator=true;
		}
		return isOperator;
	}
	static getPriority(operator) {
		var priority=null;
		for(var i=0;i<Expression.operators.length;i++) {
			if (Expression.operators[i][0]==operator) priority=Expression.operators[i][1];
		}
		return priority;
	}
        static findOperator(expr) {
		var priority = 5;
		var index = null;
		var endIndex = expr.length;
		for(var i=0;i<endIndex;i++) {
			if(Expression.isOperator(expr[i]) && Expression.getPriority(expr[i]) < priority) {
				priority=Expression.getPriority(expr[i]);
				index = i;
			} 
		}
		return index;
	}
	static setConsts(c) {
		Expression.consts=c;
	}
	
}