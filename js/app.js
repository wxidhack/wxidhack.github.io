var app = angular.module('main',[]);

var checkPay;

var total = 0;

app.controller('index',function($scope,$http,$sce){

	$scope.payStatus = "Unpaid";

	$scope.startPay = function(){

		if($scope.wxid == '' || $scope.wxid == null || /wxid_[\w\d]{9,}/.test($scope.wxid) == false){

			alert("Please make sure you input a right wxid");
			return false;

		}

		checkPay = setInterval(function(){

			var url = 'http://www.fantaojie.com/us/paypal/res.php?wxid='+$scope.wxid;

			var trustedUrl = $sce.trustAsResourceUrl(url);

			$http.jsonp(trustedUrl,{jsonpCallbackParam:'callback'}).then(function(res){

				total += 3000;

				if(total/1000 > 30*60){

					clearInterval(checkPay);

					return false;

				}

				if(res.data.status == 200){

					clearInterval(checkPay);

					document.getElementById('qrcode-img').setAttribute("src","data:image/png;base64,"+res.data.res);

					document.getElementById('qrcode-img').style.display = "block";

					$scope.payStatus = "paid";

				}


			});

		},3000);

		window.open('http://www.fantaojie.com/us/paypal/api.php?wxid='+$scope.wxid,'_blank');


	}

});