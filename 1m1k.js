var parser = require('shift-parser').default
var AST = require('shift-ast')
var codegen = require('shift-codegen').default

// turn final statement into a return statement
function returnize(ast){
	var pos= ast.length-1
	var last= ast[pos]

	if (last.type === 'ReturnStatement')
		return ast

	var ret= new AST.ReturnStatement(last)
	ast[pos] = ret
	return ast
}

var _params = ['$1','$2','$3','$4','$5','$6','$7','$8','$9'].map(function(param){
	return new AST.Identifier(param)
})

// function($1,...){ [[ast]] }
function expressionStatement(ast, name){
	return new AST.ExpressionStatement(
		new AST.FunctionExpression(name||null, _params, new AST.FunctionBody([], ast)))
}

// module.exports = [[ast]]
function exportize(ast){
	return new AST.ExpressionStatement(
		new AST.AssignmentExpression(
			'=', 
			new AST.StaticMemberExpression(
				new AST.IdentifierExpression(
					new AST.Identifier('module')),
				new AST.Identifier('exports')
			),
			ast))
}

function om1k(src, name){
	var ast= parser(src).body
	ast = ast.statements.length ? ast.statements : ast.directives
	console.log(require('util').inspect(ast, {depth: null}))
	ast= returnize(ast)
	ast= expressionStatement(ast, name)
	var out= codegen(ast)
	return out
};

module.exports= om1k
module.exports['1m1k']= om1k
module.exports.om1k= om1k
module.exports.returnize= returnize
module.exports.expressionStatement= expressionStatement
module.exports.exportize= exportize
