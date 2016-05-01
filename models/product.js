// model
var mongoose = require('mongoose');

/*var tagSchema = mongoose.Schema({
    name: String
});*/

var productSchema = mongoose.Schema({
	title:{ type:String, required:true, unique: true },
	sale_price:{ type:Number, required:true },
	description:{ type:String, required:true }
});
module.exports = mongoose.model('Products', productSchema);
