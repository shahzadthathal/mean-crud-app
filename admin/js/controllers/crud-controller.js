
adminApp.controller('CrudCtrl', ['$scope', 'UserSrvc', 'ProductSrvc', '$location', '$route', '$window', '$uibModal', 'SERVERURL', 'usSpinnerService','$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function($scope, UserSrvc, ProductSrvc,  $location, $route, $window, $uibModal, SERVERURL, usSpinnerService, $compile, DTOptionsBuilder, DTColumnBuilder ){

  $scope.edit = function(id) {
        console.log('Editing ' + id);
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        $scope.dtOptions.reloadData();
    };
    $scope.delete = function(id) {
        console.log('Deleting' + id);
        // Delete some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        $scope.dtOptions.reloadData();
    };
	
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
         // Either you specify the AjaxDataProp here
        // dataSrc: 'data',
         url: '/api/product/list',
         type: 'GET'
     })
     // or here
        .withDataProp('data')
		.withOption('aLengthMenu', [5, 10, 20, 50, 100,500])
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
		.withOption('createdRow', function(row, data, dataIndex) {
              $compile(angular.element(row).contents())($scope);
       })
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('title').withTitle('Title'),
        DTColumnBuilder.newColumn('description').withTitle('Description'),
		DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
                return '<button class="btn btn-warning" ng-click="showModal(' +  data.title  + ')">' +
                    '   <i class="fa fa-edit"></i>' +
                    '</button>&nbsp;' +
                    '<button class="btn btn-danger" ng-click="deleteItem(' + data.title+ ')">' +
                    '   <i class="fa fa-trash-o"></i>' +
                    '</button>';
            })
    ];

    $scope.showModal = function (product = null) {
		usSpinnerService.spin('spinner-1');
	  	var modalInstance = $uibModal.open({
	      templateUrl: 'partials/product-form.html',
	      controller: 'ProductModalInstanceCtrl',
	      resolve: {
                product: function () {
                	usSpinnerService.stop('spinner-1');
                    return product;
                }
            }

	    });

	    modalInstance.result.then(function () {
      		ProductSrvc.getProducts()
			.then(function (products) {
			    $scope.products = products;
			});
	    });


	};

	$scope.deleteItem = function(model){

		if(confirm("WARNING: Are you sure you want to delete this item?") == true){
			usSpinnerService.spin('spinner-1');
			return ProductSrvc.delete(model)
				   .then(function(res){
				   		var removeIndex = $scope.products.indexOf(model);
				   		$scope.products.splice(removeIndex,1);
				   		usSpinnerService.stop('spinner-1');
				   }).catch(function(e){
				   		usSpinnerService.stop('spinner-1');
				   });
		}
	}
	
}]);


adminApp.controller('ProductModalInstanceCtrl', function ($scope, product, $http, $uibModalInstance, ProductSrvc, usSpinnerService, Notification) {

    var uploadedImageName = 'noimage.png';
	$scope.product = product;	
	$scope.catsList =  $scope.subCatList = $scope.tagList = [];
	 
	if($scope.product == null){
		//console.log('product is null',$scope.product);
	}
	else{
		if($scope.product.image =='')
			$scope.product.image = uploadedImageName;
		else	
			uploadedImageName = $scope.product.image;
	}

    $scope.uploadFile = function(files) {
		    var fd = new FormData();
		    fd.append("file", files[0]);

		    return $http.post('/api/product/uploadimage', fd, {
			    	withCredentials: true,
			        headers: {'Content-Type': undefined },
			        transformRequest: angular.identity
		    	})
		     	.then(function (result) {
		     			uploadedImageName = result.data.imageName;
		     			//console.log("uploaded image name",uploadedImageName);
		      	});
	};

	$scope.submitForm = function(productForm){
		
		if(!productForm.$invalid){
			usSpinnerService.spin('spinner-1');
			$scope.product.image = uploadedImageName;

			//console.log('submitted image name',uploadedImageName);

			if($scope.product._id){
				
				return ProductSrvc.update($scope.product)
					   .then(function(result){
					   		usSpinnerService.stop('spinner-1');
					   		if(result == 'Slug exist')
					   			Notification.error({message: 'Slug already taken, please choose another!', delay: 3000});
					   		else{
					   			Notification.success({message: 'Item updated successfully!', delay: 2000});
				   				$uibModalInstance.close();
				   			}
					   })
					   .catch(function(e){
					   	    usSpinnerService.stop('spinner-1');
					   	    //$uibModalInstance.close();
					   		console.log(e);
					   });
			}
			else{

				$scope.product.image = uploadedImageName;			
				return ProductSrvc.create($scope.product)
				   .then(function(result){
				   	usSpinnerService.stop('spinner-1');
				   		if(result == 'Slug exist')
				   			Notification.error({message: 'Slug already taken, please choose another!', delay: 3000});
				   		else{
				   			Notification.success({message: 'Item created successfully!', delay: 2000});
			   				$uibModalInstance.close();
			   			}	   
				   })
				   .catch(function(e){
					   	    usSpinnerService.stop('spinner-1');
					   	    $uibModalInstance.close();
					   		console.log(e);
					   });
			}
		}	
	}

  	$scope.cancel = function () {
  		usSpinnerService.stop('spinner-1');
    	$uibModalInstance.dismiss('cancel');
  	};


});