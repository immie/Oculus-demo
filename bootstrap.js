/**
 * Bootstrapping, will be used with a script loader
 */

;(function( element ){
	'use strict';
	angular.bootstrap( element, ['oculusDemo'] );
	
})(document.querySelector('body'));