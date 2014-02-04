;(function(){
	'use strict';

	angular.module( 'oculusDemo' )
	.controller( 'homeController', [ '$scope', 'youtubeAPIService',
		function( $scope, youtubeAPIService ){

			var currentResults = {
				metaData: {}
			};

			$scope.data = {
				videoId: 'k7n5kRRHDpw',
				items:{},
				results:null,
				keyword: 'oculus'
			};

			var initialize = function(){
				var call = youtubeAPIService.searchKeyword( $scope.data.keyword );
				call.then(function(data){
					$scope.data.items = data.items;
					currentResults.metaData.nextPageToken = data.nextPageToken;
				});
			}

			$scope.updateVideo = function( video ){
				$scope.$apply($scope.data.video = video);
			};

			/**
			 * Called by the scrollLoadResults directive when the user scrolls to the bottom of the list.
			 */
			$scope.fetchMoreVideos = function(){
				var params = youtubeAPIService.getSearchParams(),
					pNetworkCall;

				params.pageToken = currentResults.metaData.nextPageToken;
				youtubeAPIService.setSearchParam( params );

				pNetworkCall = youtubeAPIService.searchKeyword( $scope.data.keyword );
				pNetworkCall.then( function( data ){
					angular.forEach( data.items, function(value, key){
						$scope.data.items.push( value );
					});
					
					currentResults.metaData.nextPageToken = data.nextPageToken;
				})

			};

			$scope.$watch( 'data.keyword', function(){
				if( !!$scope.data.keyword ){
					initialize();
				}
			})

			return initialize();

		}]);
})();