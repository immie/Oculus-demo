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
						angular.element( element.parent()[0].querySelectorAll('.active') ).removeClass('active');
						element.addClass('active');
					});
					// scope.prettyFormat = angular.toJson(scope.videoData.snippet, true);
				}
			}
		}])
	.directive( 'scrollLoadResults' , [function(){
		return{
			restrict: 'A',
			scope:{
				pingCallback: '&'
			},
			link: function(scope,element,attrs){
				var raw = element[0];
        
        		/**
        		 * TODO: Need a solution to put a governor on this event
        		 */
		        element.bind('scroll', function() {
		            if (raw.scrollTop + raw.offsetHeight >= ( raw.scrollHeight - 100 ) ) {
		                scope.pingCallback();
		            }
		        });
			}
		}
	}])
	.run( [ '$templateCache', function( $templateCache ) {
		$templateCache.put('youtube/thumbnail.html', 
			'<div class="mod-thumbnail">'+
			'	<img ng-src="{{videoData.snippet.thumbnails.default.url}}"/>'+
			'	<div class="thumbnail-title">{{videoData.snippet.title}}</div>'+
			'	<div class="thumbnail-description">{{videoData.snippet.description}}</div>'+
			'</div>'
		);
	}]);
})();