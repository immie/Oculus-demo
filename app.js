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

