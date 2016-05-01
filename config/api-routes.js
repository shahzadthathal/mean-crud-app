
 // API Routes
 
  var Controllers = require('../controllers'); 
  
  module.exports = function(app, auth) {
    


	// User Routes  
	app.post('/api/users/create', Controllers.UserCtrl.create);
    app.post('/api/users/login', Controllers.UserCtrl.login); 
    app.get('/api/users/me', auth.requiresLogin, Controllers.UserCtrl.me);
	app.put('/api/users/update/:id', auth.requiresLogin, Controllers.UserCtrl.update);
	
	
	// Product Routes
	app.get('/api/product/list', Controllers.ProductCtrl.list);	
	app.post('/api/product/create', auth.requiresLogin, Controllers.ProductCtrl.create);
	app.post('/api/product/uploadimage', auth.requiresLogin, Controllers.ProductCtrl.uploadImage);
	app.put('/api/product/update/:id', auth.requiresLogin, Controllers.ProductCtrl.update);
    app.delete('/api/product/delete/:id', auth.requiresLogin, Controllers.ProductCtrl.delete);
	
  }
