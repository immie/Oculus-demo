;(function(){
	'use strict';

	/**
	 * Oculus Demo Module.  Main driver
	 * Depedencies:
	 * ngRoute : $routeProvider
	 * http-interceptor : $httpProvider
	 */
	angular.module( 'oculus-demo', [ 'ngRoute', 'http-interceptor' ] )
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/', { templateUrl: 'partials/home.html', controller: 'homeController' })
		.otherwise( {redirectTo:'/'} );
	}]);
})();