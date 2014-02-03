;(function () {
    'use strict';

    angular.module('http-interceptor', [])
    .config(['$httpProvider', function($httpProvider) {

        var interceptor = ['$rootScope', '$q', function($rootScope, $q) {

            /**
            * [Looking for server codes starting with "4" or "5"]
            * @type {RegExp}
            */
            var errorMsgReg = new RegExp(/^(5|4)/);

            /**
             * success callback for the promise.  Information is just passed through.
             * @param  {[type]} response [description]
             * @return {[type]}          [description]
             */
            function success( response ) {
                return response;
            }

            /**
             * [error description]
             * @param  {[type]} response [description]
             * @return {[type]}          [description]
             */
            function error( response ) {
                var message;
                if ( errorMsgReg.test(response.status) ) {
                    // broadcasting to userMessage-directive
                    $rootScope.$broadcast('event:userMessage', message);
                }
                // otherwise, default behavior
                return $q.reject(response);
            }

            /**
             * [function returned for the responseInterceptor]
             * @param  {[type]} promise [description]
             * @return {[type]}         [description]
             */
            return function(promise) {
                return promise.then(success, error);
            };

        }];

        $httpProvider.responseInterceptors.push(interceptor);
    }]);
    
})();
/**
 * Generic module for interaction with youtube.
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
					scope.$watch('video', function(){
						if( !angular.equals(scope.video, {}) && !!scope.video.id.videoId ){
							scope.updateVideo();
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
;(function(){
	'use strict';

	/**
	 * Oculus Demo Module.  Main driver
	 * Depedencies:
	 * ngRoute : $routeProvider
	 * http-interceptor : $httpProvider
	 * youtubeModule : the blackbox interaction with youtube
	 */
	angular.module( 'oculusDemo', [ 'ngRoute', 'http-interceptor', 'youtubeModule' ] )
	.config(['$routeProvider', function( $routeProvider ) {
		$routeProvider
		.when('/', { templateUrl: 'partials/home.html', controller: 'homeController' })
		.otherwise( {redirectTo:'/'} );
	}]);
})();

/**
 * Bootstrapping, will be used with a script loader
 */

;(function( element ){
	'use strict';
	setTimeout(function(){
		angular.bootstrap( element, ['oculusDemo'] );
	}, 200);
	
})(document.querySelector('body'));
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
;(function(){
	'use strict';

	angular.module( 'oculusDemo' )
	.directive( 'thumbNail', [ 
		function(){
			return{
				restrict: 'E',
				replace: true,
				scope: {
					videoData: '=',
					userSelectedVideo: '&'
				},
				templateUrl: 'youtube/thumbnail.html',
				link: function(scope,element,attrs){
					element.on( 'click', function(){
						scope.userSelectedVideo({video: scope.videoData});
					})
				}
			}
		}])
	.run( [ '$templateCache', function( $templateCache ) {
		$templateCache.put('youtube/thumbnail.html', 
			'<div class="mod-thumbnail">'+
			'	<img ng-src="{{videoData.snippet.thumbnails.default.url}}"/>'+
			'</div>'
		);
	}]);
})();
