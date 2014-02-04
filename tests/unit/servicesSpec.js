'use strict';

describe( 'Unit tests for services', function(){

	describe( 'oculusDemo services', function(){
		beforeEach(module('oculusDemo'));
	});
	
	describe( 'youtube module services', function(){
		var youtubeService;
		beforeEach(module('youtubeModule'));

		describe( 'checking the default getSearchParams', function(){
			function buildParams( params ){
				var str = "";
				for( var param in  params ){
					str += param + '=' + params[param] + '&'
				}
				return str.substring(0,str.length-1);
			}

			it( 'should have the hard coded values upon initialization', inject(function(youtubeAPIService){
			/**
			 * searchParamDefaults = {
					key:'AIzaSyAD0zYSogTVsvGNGnnWJKghb7jms3dua4M',
					part: 'snippet',
					type: 'video',
					q: 'Oculus',
					callback: 'JSON_CALLBACK',
					maxResults: 20
				}
			 */
				var params = youtubeAPIService.getSearchParams();
				expect(params.key).toBe('AIzaSyAD0zYSogTVsvGNGnnWJKghb7jms3dua4M');
				expect(params.part).toBe('snippet');
				expect(params.type).toBe('video');
				expect(params.q).toBe('Oculus');
				expect(params.callback).toBe('JSON_CALLBACK');
				expect(params.maxResults).toBe(20);
			}));

			it( 'should allow the overriding of the default search results', inject(function(youtubeAPIService){

				/**
				 * This is call in the controller when updating the search keyword
				 */
				var params = youtubeAPIService.getSearchParams();
				expect(params.q).toBe('Oculus');

				params.q = "Haselton";
				youtubeAPIService.setSearchParam( params );

				params = youtubeAPIService.getSearchParams();
				expect(params.q).toBe('Haselton');
			}));


			it( 'should load the youtube player script and call the youtube defined function', inject(function($window, youtubeAPIService){
				var promise;
				spyOn($window, 'onYouTubePlayerAPIReady');
				expect($window.onYouTubePlayerAPIReady).not.toHaveBeenCalled();

				promise = youtubeAPIService.setUpYoutube();
				promise.then(function(){
					expect($window.onYouTubePlayerAPIReady).toHaveBeenCalled();
				})
			}));

			it( 'should load the youtube player script only once even if there are multiple players invoked', inject(function($window, youtubeAPIService){
				var promise,
					promise1;
				spyOn($window, 'onYouTubePlayerAPIReady');
				
				promise = youtubeAPIService.setUpYoutube();
				promise.then(function(){
					expect($window.onYouTubePlayerAPIReadycalls.length).toBe(1);

					// we make sure that we only add the script once.
					promise1 = youtubeAPIService.setUpYoutube();
					promise1.then(function(){
						expect($window.onYouTubePlayerAPIReadycalls.length).toBe(1)
					});
				});
			}));

			it( 'code coverage test with testing of API call', inject(function($httpBackend, youtubeAPIService){
				var promiseResults,
					qStr = "";
				//qStr = buildParams(youtubeAPIService.getSearchParams());
				//console.log(qStr);
				$httpBackend.when('JSONP', 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyAD0zYSogTVsvGNGnnWJKghb7jms3dua4M&maxResults=20&part=snippet&q=oculus&type=video').respond({q:'oculus'});
				$httpBackend.when('JSONP', 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyAD0zYSogTVsvGNGnnWJKghb7jms3dua4M&maxResults=20&part=snippet&q=haselton&type=video').respond({q:'haselton'});
				promiseResults = youtubeAPIService.searchKeyword('oculus');
				promiseResults.then(function(data){
					expect(data.q).toBe('oculus');
				});
				$httpBackend.flush();

				promiseResults = youtubeAPIService.searchKeyword('haselton');
				promiseResults.then(function(data){
					expect(data.q).toBe('haselton');
				});
				$httpBackend.flush();

			}));
		});


	});
	

});