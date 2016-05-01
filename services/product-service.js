
// Product Service

  var Promise = require('promise');
  var Models = require('../models');


function list(req) {
    var list = {};
    
    /*
    return Models.ProductModel.find()
          .then(function(results){
           return results;
         });
    */

    console.log(req.query.start);
    console.log(req.query.length);
    console.log(req.query.draw);

    return Models.ProductModel.count()
         .then(function(total){
          list.recordsTotal = total;
          list.recordsFiltered = total;
          return Models.ProductModel.find().skip(req.query.start).limit(req.query.length);
         })
         .then(function(results){
           
           list.draw = req.query.draw;
           list.data = results;
           return list;
         });
      
  
	/*return Promise.denodeify(Models.ProductModel.find.bind(Models.ProductModel)) ({},{limit:2})
    .then(function (results) {
      return results;
    });
    */
}
function detail(slug){
    return getBySlug(slug)
          .then(function(product){
            return product;
          });
}

function listByCategory(cateid){
   return Promise.denodeify(Models.ProductModel.find.bind(Models.ProductModel))({category:cateid})
      .then(function(results){
          return results;
      });
}

function listBySubCategory(cateid){
   return Promise.denodeify(Models.ProductModel.find.bind(Models.ProductModel))({sub_category:cateid})
      .then(function(results){
          return results;
      });
}

function listByTag(tag){
    return Promise.denodeify(Models.ProductModel.find.bind(Models.ProductModel))({ tags: tag })
      .then(function(results){
          return results;
      });
}

function create(data) {

          var product = new Models.ProductModel({ 
              title: data.title,
              sale_price: data.sale_price,
              description: data.description
            });
            return Promise.denodeify(product.save.bind(product))()
            .then(function (product) {
                return product;
          });
}

function update(id, data) {
  
        return get(id)
          .then(function (product) {
              product.title = data.title,
          	  product.sale_price = data.sale_price,
          	  product.description = data.description
			  
              return Promise.denodeify(product.save.bind(product))()
          })
          .then(function (product) {
            return product;
          });
  }

  
function remove(id) {
    return Promise.denodeify(Models.ProductModel.remove.bind(Models.ProductModel))({ _id: id })
    .then(function () {
      return;
    })
}

function get(id) {
    return Promise.denodeify(Models.ProductModel.findById.bind(Models.ProductModel))(id)
    .then(function (model) {
      return model;
    });
}

function getBySlug(slug){
  return Promise.denodeify(Models.ProductModel.findOne.bind(Models.ProductModel))({slug:slug})
  .then(function(model){
    return model;
  });
}


module.exports = {
	list:list,
  detail:detail,
  listByCategory:listByCategory,
  listBySubCategory:listBySubCategory,
	create:create,
	update:update,
	remove:remove,
	get:get,
  getBySlug:getBySlug,
  listByTag:listByTag
}