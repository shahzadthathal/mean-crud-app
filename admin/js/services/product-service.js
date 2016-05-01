adminApp.factory('ProductSrvc', function ($http) {
  return {
    getProducts: function (pageNo, pageSize) {
      return $http.get('/api/product/list')
      .then(function (result) {
        return result.data;
      });
    },
    getProductsByTag: function(tag){
      return $http.get('/api/product/list-by-tag/'+ tag)
      .then(function (result) {
        return result.data;
      });
    },
    create: function (product) {
      return $http.post('/api/product/create', product)
      .then(function (result) {
        return result.data;
      });
    },
    update: function (product) {
      return $http.put('/api/product/update/' + product._id, product)
      .then(function (result) {
        return result.data;
      });
    },
    delete: function (product) {
      return $http.delete('/api/product/delete/' + product._id, product)
      .then(function () {
        return;
      }); 
    }    
  }
});