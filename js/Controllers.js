;(function(){
	'use strict';

	angular.module( 'oculusDemo' )
	.controller( 'homeController', [ '$scope', 'youtubeAPIService',
		function( $scope, youtubeAPIService ){

			$scope.data = {
				videoId: 'M7lc1UVf-VE',
				video:{},
				results:null
			};

			var initialize = function(){
				var call = youtubeAPIService.searchKeyword('oculus');
				call.then(function(data){
					$scope.data.results = data;
				});
			}

			$scope.updateVideo = function( video ){
				$scope.$apply($scope.data.video = video);
			};

			return initialize();

		}]);
})();