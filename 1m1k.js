var parser = require('shift-parser')

module.exports = function(src){
	var ast = parser(src)
	console.log(ast)
	return 0
}
