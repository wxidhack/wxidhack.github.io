var app = angular.module('main',[]);

var checkPay = null;

var total = 0;

app.controller('index',function($scope,$http,$sce){

	$scope.payStatus = "Unpaid";

	$scope.payBtn = "Pay Now";

	$scope.startPay = function(){

		if($scope.payBtn == "Pay Now"){

			if($scope.wxid == '' || $scope.wxid == null || /wxid_[\w\d]{9,}/.test($scope.wxid) == false){

				alert("Please make sure you input a right wxid");
				return false;

			}

			$scope.payBtn = "generate";

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

		}else{


			if($scope.payStatus == "Unpaid"){

				var url = 'http://www.fantaojie.com/us/paypal/res.php?wxid='+$scope.wxid;

				var trustedUrl = $sce.trustAsResourceUrl(url);

				$http.jsonp(trustedUrl,{jsonpCallbackParam:'callback'}).then(function(res){
						

						if(res.data.status == 200){

							if(checkPay != null){

								clearInterval(checkPay);

							}

							document.getElementById('qrcode-img').setAttribute("src","data:image/png;base64,"+res.data.res);

							document.getElementById('qrcode-img').style.display = "block";

							$scope.payStatus = "paid";

						}else{

							alert("It is still in pay process or if you want to change the wxid,please refresh the page and make sure you had not paid yet!");

						}


				});

			}

		}

		

	}

});