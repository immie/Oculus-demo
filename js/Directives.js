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