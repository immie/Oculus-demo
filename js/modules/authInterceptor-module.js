;(function () {
    'use strict';

    angular.module('http-interceptor', [])
    .config(['$httpProvider', function($httpProvider) {

        var interceptor = ['$q', '$log', function( $q, $log ) {

            /**
            * [Looking for server codes starting with "4" or "5"]
            * @type {RegExp}
            */
            var errorMsgReg = new RegExp(/^(5|4|0)/);

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
                if ( errorMsgReg.test(response.status) ) {
                    // broadcasting to userMessage-directive
                    $log.error( 'network error: ', response );
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