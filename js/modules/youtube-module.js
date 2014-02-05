/**
 * Generic module for interaction with youtube.
 * @link  {https://developers.google.com/youtube/v3/docs/search/list}
 */
;(function(){
	'use strict';

	angular.module( 'youtubeModule', [] )
	.factory( 'youtubeAPIService', [ '$http', '$log', '$q', '$window',
		function( $http, $log, $q, $window ){

			var searchParamDefaults = {
					key:'AIzaSyAD0zYSogTVsvGNGnnWJKghb7jms3dua4M',
					part: 'snippet',
					type: 'video',
					q: 'Oculus',
					callback: 'JSON_CALLBACK',
					maxResults: 20
				},
				defaultHttpConfig = {
					method: 'JSONP',
					cache: true,
					url: 'https://www.googleapis.com/youtube/v3/search',
				},
				isYoutubePlayerLoaded = false,
				pScriptLoaded = $q.defer();

			/**
			 * Youtube player specific callback when API is loaded
			 * @param  { Int } youtubePlayerId [description]
			 */
			$window.onYouTubePlayerAPIReady = function( youtubePlayerId ) {
				pScriptLoaded.resolve();
			};


			return{

				setUpYoutube: function(){
					/**
					 * This will call onYouTubePlayerAPIReady function on the window object
					 */
					if( !isYoutubePlayerLoaded ){
						var tag = document.createElement('script'),
							firstScriptTag = document.getElementsByTagName('script')[0];

						isYoutubePlayerLoaded = true;

						tag.src = "https://www.youtube.com/player_api";
						firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
					}

					return pScriptLoaded.promise;
				},

				/**
				 * Set angular network params.  Needed for testing.
				 * @param {Object} config
				 */
				setHttpConfig: function( config ){
					if( angular.isObject( config ) ){
						defaultHttpConfig = config;
					}
				},

				/**
				 * Allows the consumer to update default search parameters on the network request.  Needed for testing purposes too.
				 * @param {Object} params assigns private 'searchParamDefaults' variable used in the network request
				 * TODO: need further error checking vs straight assignment.
				 */
				setSearchParam: function( params ){
					if( angular.isObject( params ) ){
						searchParamDefaults = params
					}
				},

				/**
				 * Get a copy of the default object to make changes to
				 * @return {Object} searchParamDefaults
				 */
				getSearchParams: function(){
					return searchParamDefaults;
				},

				/**
				 * Search request will be made via youtube API
				 * @param  {Array|String} keywords on which to search on
				 * @return {Object Promise}  $http promise.
				 */
				searchKeyword: function( keywords ){
					var httpConfig = {},
						pNetworkCall = $q.defer();

					searchParamDefaults.q = ( angular.isArray( keywords ) ) ? keywords.join(',') : keywords;
					
					angular.extend( httpConfig, defaultHttpConfig );
					httpConfig.params = searchParamDefaults;

					$http( httpConfig )
						.success( function(data){
							pNetworkCall.resolve( data );
						})
						.error( function( data ){
							pNetworkCall.reject( data );
						});

					return pNetworkCall.promise;
				},
			};

		}])
	.directive( 'youtubePlayer', [ 
		function(){
			return{
				restrict: 'EA',
				scope: {
					video: '='
				},
				controller: ['$scope', '$element', '$attrs', '$window', 'youtubeAPIService', function( $scope, $element, $attrs, $window, youtubeAPIService ){
					/**
					 * Private variable of the instance of the player assigned to the directive.
					 */
					var youtubePlayer;

					/**
					 * Initialize youtube player instance to private service variable
					 */
					$scope.createPlayer = function(){

						/**
						 * Hit the service that is managing the script loading for this global action "YT".  The service returns a promise based on the script's loaded status
						 */
						var pIsScriptLoaded = youtubeAPIService.setUpYoutube();

						pIsScriptLoaded.then(function(){
							youtubePlayer = new $window.YT.Player($attrs.id, {
						    	videoId: $attrs.defaultvideoid
						    });
						})
						
					}

					$scope.updateVideo = function(){
						/**
						 * @link {https://developers.google.com/youtube/js_api_reference?hl=en#cueVideoById}
						 */
						youtubePlayer.cueVideoById( $scope.video.id.videoId );
					};
				}],
				templateUrl: 'youtube/player.html',
				link: function( scope, element, attrs ){

					/** watch for a video change */
					scope.$watch('video', function(){
						if( scope.video !== undefined && !angular.equals(scope.video, {}) && !!scope.video.id.videoId ){
							scope.updateVideo();
							console.log(scope.video);
						}
					});

					scope.createPlayer();
				}
			};
		}])
	.run( [ '$templateCache', function( $templateCache ) {
		$templateCache.put('youtube/player.html', 
			'{{video}}'
		);
	}]);;
})()