'use strict';

describe( 'Unit tests for services', function(){

	describe( 'oculusDemo services', function(){
		beforeEach(module('oculusDemo'));
	});
	
	describe( 'youtube module services', function(){
		var youtubeService;
		beforeEach(module('youtubeModule'));

		describe( 'checking the default getSearchParams', inject( function( youtubeAPIService ){
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
		}));


	});
	

});