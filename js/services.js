'use strict';

/* Services */

angular.module('CmsServices', ['ngCookies'], function ($provide) {

    $provide.factory('$rpc', ['$http', '$cacheFactory','$q', function ($http, $cacheFactory,$q) {
        var id = 1;
        var cache = $cacheFactory('otysCache');
        return function (method, params, callback, failure, cacheId, cacheTtl, hideLoader) {

            // @FIXME: implement cacheTtl
            var currentTs = Math.floor(Date.now() / 1000);
            var expiryTs = (cacheTtl > 0) ? (currentTs + cacheTtl) : 0;

        	if (method == undefined) {
        		return {
        			flushCaches: function() {
        				//console.log('CACHE FLUSH');
        				cache.removeAll();
        			},
                    removeFromCache: function(cacheId) {
        				//console.log('CACHE REMOVE');
        				cache.remove(cacheId);
        			},
        			putToCache: function(cacheId, value, ttl) {
                        var expiryTs = (ttl > 0) ? (currentTs + ttl) : 0;
        				cache.put(cacheId, { expiryTs: expiryTs, value: angular.copy(value) });
        			}, 
        			isCached: function(cacheId) {
        				return cache.get(cacheId) != undefined;
        			} 
        		};
        	}
        	
            var bodyRequest = JSON.stringify({
                "jsonrpc": "2.0",
                "method": method,
                "params": params,
                "id": id
            });
            
            if (cacheId != undefined && cacheId != null) {
        		var result = angular.copy(cache.get(cacheId));
        		if (result != undefined) {

                    if (result.expiryTs > 0 && result.expiryTs < currentTs) {
                        //console.log(method + ': expired ' + (currentTs - result.expiryTs) + ' seconds ago');
                        cache.remove(cacheId);
                    }
                    else {
            			//console.log('CACHE HIT: ' + cacheId);
                        if (result.expiryTs > 0) {
                            //console.log(method + ': will expire in ' + (result.expiryTs - currentTs) + ' seconds');
                        }
            			if (callback != undefined && callback != null) {
            				callback(result.value);
            			}
            			return;
                    }

        		}
        	}

            if (hideLoader == undefined || !hideLoader) {
                $('#loadingSpinner').css('display', 'block');
            }

            var headers = { 'Content-Type': 'application/json' };
            
            var remark = method;

            $http({
                'url': 'backend/index.php?remark=' + remark,
                'method': 'POST',
                'data': bodyRequest,
                'headers': headers
            }).success(function (data, status, headers, config) {


            	if (data instanceof Object && data.error != undefined) {
                    console.log('Remote exception thrown:');
                    console.log(data.error.message);
                    failure(data);
                    return;
            	}
            	if (cacheId != undefined && cacheId != null) {
            		cache.put(cacheId, { expiryTs: expiryTs, value: angular.copy(data.result) });
            	}
                if (callback != undefined && callback != null) {
                    callback(data.result);
                }
            }).error(function (data, status, headers, config) {


                if (failure != undefined && failure != null) {
                    failure(data);
                }
                else {
                    console.log('Request failed [' + status + ']:');
                    console.log(data);
                    console.log(method);
                    console.log(params);

                    // if status is 0 then probably ongoing request has been cancelled because of location URL change,
                    // do not display any error in such case
                    if (status != 0) {
                        alert('Request failed.');
                    }
                }
            });
            id = id + 1;
        };
    }]);

    $provide.factory('$auth', ['$rpc', '$cookies', '$window', '$location', '$rootScope', function ($rpc, $cookies, $window, $location, $rootScope) {
        var sid = null;
        var userId = null;
        var user = null;
        var failureQueue = [];

        return {
            isLoggedIn: function () {

                return this.getSessionId() == null;
            },
            getSessionId: function () {
                if (sid == null) {
                    sid = $cookies.get('PHPSESSID');
                }
                return sid;
            },
            getUser: function() {
            	return user;
            },
            getUserId: function() {
            	return userId;
            },
            login: function (username, password, callback, failure) {
            	var self = this;
            	this._destroySession();
                $rpc(
  		            'login',
  		            [username, password],
  		            function (res) {
  		            	if (res == false) {
  		            		failure(res);
  		            		return;
  		            	}
  		                sid = res;
                        $cookies.put("PHPSESSID", sid);
  		                self.check(callback);
  		            },
                    failure
  	            );
            },
            check: function(callback){
                if(this.getUser()) return;
                $rpc(
                    'check',
                    [this.getSessionId()], function(res){
                        user = res;

                        userId = res.uid;
                        $rootScope.user = res;
                        $rootScope.isAuthenticated = true;
                        if(undefined != callback) callback(res);
                    }
                );
            },
            logout: function (callback) {
            	this._destroySession();
            	document.cookie = 'login=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
                $rpc(
  		            'logout',
  		            [sid],
  		            function (res) {
  		                sid = null;
  		                userId = null;
                        if(callback != undefined) {
      		                callback();
                        }
                            $window.location.href="#/login";
                            $window.location.reload();
  		            }
  	            );
            },

            _destroySession: function () {
            	$rpc().flushCaches();
            }

        };
    }]);

    $provide.factory('$ws', ['$rpc', '$cookies', '$auth', '$cacheFactory', '$timeout', '$rootScope', '$q', function ($rpc, $cookies, $auth, $cacheFactory, $timeout, $rootScope, $q) {
        return function (method, params, callback, failure, cacheId, cacheTtl, hideLoader) {

            if (cacheId != undefined && cacheId != null) {
                // generate cache ID automatically to prevent conflicts
                cacheId = angular.toJson([ method, params, cacheTtl ]);
            }

        	var serviceName = method.split('.')[0];

            $rpc(method, [ $auth.getSessionId() ].concat(params), callback, failure, cacheId, cacheTtl, hideLoader);
            return cacheId;
        };
    }]);



});