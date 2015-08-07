'use strict';

/* Services */

angular.module('otysServices', ['ngCookies'], function ($provide) {

    $provide.factory('$rpc', ['$http', '$cacheFactory', '$modal','$q', function ($http, $cacheFactory,$modal,$q) {
        var id = 1;
        var cache = $cacheFactory('otysCache');
        var requestsCount = 0;
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

            requestsCount++;
            if (hideLoader == undefined || !hideLoader) {
                $('#loadingSpinner').css('display', 'block');
            }

            var headers = { 'Content-Type': 'application/json' };
            
            var remark = method;
            
            if (method == 'Otys.Services.MultiService.execute') {
            	
            	remark = [];
            	angular.forEach(params[0], function(call) {
            		remark.push(call.method);
            	});
            	remark = remark.join(',');
            	
            }
            
            $http({
                //'url': '/jservice.php',
                'url': '/jservice.php?remark=' + remark, // BKo: adding the method name to the URL just for easier debugging
                'method': 'POST',
                'data': bodyRequest,
                'headers': headers
            }).success(function (data, status, headers, config) {

                requestsCount--;
                if (requestsCount <= 0) {
                    $('#loadingSpinner').css('display', 'none');
                }

            	if (data instanceof Object && data.error != undefined) {
            		if (failure != undefined && failure != null) {
                        require(['lib/errors/mapping'], function () {
                            alert(error_map(data.error.message));
                        });
                        failure(data);
                    }
            		else {
            			//alert(data.error.message);
                        console.log('Remote exception thrown:');
                        console.log(data.error.message);

                    //    console.log(params);

                        require(['lib/errors/mapping'], function () {
                            alert(error_map(data.error.message));
                        });
            		}
            		return;
            	}
            	if (cacheId != undefined && cacheId != null) {
            		cache.put(cacheId, { expiryTs: expiryTs, value: angular.copy(data.result) });
            	}
                if (callback != undefined && callback != null) {
                    callback(data.result);
                }
            }).error(function (data, status, headers, config) {

                requestsCount--;
                if (requestsCount <= 0) {
                    $('#loadingSpinner').css('display', 'none');
                }

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

    $provide.factory('$misc', function() {
        return {
            genS4 : function()
            {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            },
            genUid : function ()
            {
                var out = this.genS4();
                for(var i=1; i<4; i++)
                    out += this.genS4();
                return out;
            }
        };
    });

    $provide.factory('$auth', ['$rpc', '$cookies', '$moduleStatus', '$window', '$location', '$rootScope', function ($rpc, $cookies, $moduleStatus, $window, $location, $rootScope) {
        var sid = null;
        var originalUser = null;
        var userId = null;
        var user = null;
		var loginCallbacks = [];
		var logoutCallbacks = [];
        var successQueue = [];
        var failureQueue = [];
        var checked = false;
        var checkActive = false;

        return {
            isLoggedIn: function () {

                return this.getSessionId() == null;
            },
            getSessionId: function () {
                if (sid == null) {
                    sid = $cookies['PHPSESSID'];
                }
                if(sid !== null && sid !== undefined) {
                    var check = 0;
                    for (var i in sid){
                        check++;
                    }
                    if (check !== 26 && check !== 59){
                        SchaapCrash
                    }
                }
                if(sid !== null && sid !== undefined) {
                    if (sid.toLowerCase().indexOf('sessionid') !== -1) {
                        méééh
                    }
                }
             return sid;
            },
            getUser: function() {
            	return user;
            },
            getOriginalUser: function() {
                return originalUser;
            },
            getUserId: function() {
            	return userId;
            },
            check: function(success, failure, hideLoader) {
            	if (checked) {

            		success(user);
            		return;
            	}

                successQueue.push(success);
                failureQueue.push(failure);

                if(checkActive) {
                    return;
                }
                checkActive = true;

                //alert('check');

                var self = this;
                $rpc(
                    'check',
                    [ this.getSessionId() ],
                    function (data) {
                        if (data) {
                            // CLIENT BLOCK START
                           /* if (data.clientId != 1 && data.clientId != 520 && data.clientId != 1053 && data.clientId != 1082 && data.clientId != 1942 && data.clientId != 2063 && data.clientId != 1778 && data.clientId != 2101 && data.clientId != 345 && data.clientId != 830 && data.clientId != 830 && data.clientId != 688 && data.clientId != 1941 && data.clientId != 2114) {
                                alert("Access denied due to the client block.");
                                self.logout();
                                return;
                            }*/
                            // CLIENT BLOCK END
                            originalUser = data.originalUser;
                            userId = data.id;
                            user = data;
                            self._loadSettings(function() {
                                while (successQueue.length > 0) {
                                    successQueue.shift()(user);
                                }

                                angular.forEach(loginCallbacks, function(callback) {
                                    if (callback != undefined) {
                                        callback();
                                    }
                                });
                                //loginCallbacks = [];

                                checkActive = false;
                                
                                checked = true;
                                
                            });
                        }
                        else {
                            for(var index in failureQueue) {
                                failure = failureQueue[index];

                                if(failure !== undefined){
                                    failure(user);
                                }                                
                            }
                            checkActive = false;
                        }                       
                    },
                    function (data) {
                            for(var index in failureQueue) {
                                failure = failureQueue[index];

                                if(failure !== undefined){
                                    failure(user);
                                }                                
                            }
                            checkActive = false;
                    },
                    null,
                    null,
                    hideLoader!=undefined ? hideLoader : false
                );

            },
            login: function (username, password, callback, failure) {
            	var self = this;
            	this._destroySession();
                $rpc(
  		            'login',
  		            [username, password, null, null, 'phoenix'],
  		            function (res) {
  		            	if (res == false) {
  		            		failure(res);
  		            		return;
  		            	}
  		                sid = res;
  		                self.check(callback);
  		            },
                    failure
  	            );
            },
            loginAs: function (uid, callback, failure) {
                var self = this;
                var sid2 = this.getSessionId();


                $rpc(
                    'loginAs',
                    [sid2,uid, null,null, 'phoenix'],
                    function (res) {
                        if (res == false) {
                            failure(res);
                            return;
                        }
                        sid = res;
                        checked = false;
                        self.check(callback);
                    },
                    failure
                );
            },
            loginByUid: function (uid, callback, failure) {
                var self = this;
                this._destroySession();
                $rpc(
                    'loginByUid',
                    [uid, null, null, 'phoenix'],
                    function (res) {
                        if (res == false) {
                            failure(res);
                            return;
                        }
                        sid = res;
                        self.check(callback);
                    },
                    failure
                );
            },
            logout: function (callback) {
				angular.forEach(logoutCallbacks, function(cb) {
					if (cb != undefined) {
						cb();
					}
				});
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
                        //$rootScope.$apply(function() {
                            //$location.path('/login');
                            $window.location.href="#/login";
                            $window.location.reload();
                        //});
  		            }
  	            );
            },
			registerLoginCallback: function (callback) {
				loginCallbacks.push(callback);
			},
			registerLogoutCallback: function (callback) {
				logoutCallbacks.push(callback);
			},
            reloadSettings: function(success) {
                $rpc().removeFromCache('userSettings');
                this._loadSettings(success);
            },
            _destroySession: function () {
            	$rpc().flushCaches();
            	$moduleStatus.removeAll();
            	checkActive = false;
            	checked = false;
            },
			_loadSettings: function(success) {
				var self = this;
				$rpc(
					'Otys.Services.SettingsService.get', [
						this.getSessionId(), {					
							_USER: [ 'amqp_password' ],
							bo_jobs: [ 'procedures_reports', 'procedures_reports_manager' ],
                            bo_modules: [ 'interactions', 'news', 'sales_tracker', 'activities' ],
                            phoenix_fo: [
                                'phoenix_chat',
                                'phoenix_use_chat',
                                'openInNewTab_Candidates',
                                'openInNewTab_RSS',
                                'openInNewTab_Assignments',
                                'openInNewTab_SMS',
                                'openInNewTab_Templates',
                                'openInNewTab_CMS',
                                'openInNewTab_Support',
                                'openInNewTab_Invoices',
                                'openInNewTab_Timesheets',
                                'openInNewTab_Newsletters',
                                'openInNewTab_SalesTracker',
                                'openInNewTab_Tasks',
                                'openInNewTab_Reminders',
                                'openInNewTab_Calendar',
                                'openInNewTab_Emails',
                                'openInNewTab_Relations',
                                'openInNewTab_Vacancies',
                                'resultsPerPage_Vacancy',
                                'resultsPerPage_Candidate',
                                'resultsPerPage_Relation',
                                'resultsPerPage_Email',
                                'resultsPerPage_SalesTrajectory',
                                'phoenix_extsearch_mc_condition',
                                'openInFilterMode_Candidates',
                                'openInFilterMode_Vacancies',
                                'openInFilterMode_Relations',
                                'openInFilterMode_Emails',
                                'openInFilterMode_Reminders',
                                'openInFilterMode_SalesTracker',
                                'openInFilterMode_Newsletters',
                                'openInFilterMode_Timesheets',
                                'openInFilterMode_Invoices',
                                'openInFilterMode_Support',
                                'openInFilterMode_Templates',
                                'openInFilterMode_SMS',
                                'openInFilterMode_Assignments',
                                'openInFilterMode_RSS',
                                'openInFilterMode_Activities',
                                'openInFilterMode_Interactions',
                                'openInFilterMode_Workflows',
                                'phoenix_modules_show_desktop',
                                'phoenix_modules_show_mobile'
                            ],
                            bo_client: [
                                'fim_internal_usage',
                                'default_country'
                            ]
						}
					],
					function(res) {
						user.stompPassword = res._USER.amqp_password;
						user.reports = res.bo_jobs.procedures_reports;
						user.reportsAdmin = res.bo_jobs.procedures_reports_manager;
                        user.chatAllowed = res.phoenix_fo.phoenix_chat;
                        user.chatEnabled = res.phoenix_fo.phoenix_use_chat;
                        user.freeInteractions = res.bo_modules.interactions;
                        user.freeInteractionsInternal = res.bo_client.fim_internal_usage;

                        user.newTabModules = [];
                        user.resultsPerPage = {};
                        user.filterModeModules = [];

                        angular.forEach(res.phoenix_fo, function(settingValue, settingName) {
                            if (settingName.substr(0, 13) == 'openInNewTab_' && (settingValue == 1 || settingValue == true)) {
                                user.newTabModules.push(settingName.substr(13));
                            }
                            if (settingName.substr(0, 15) == 'resultsPerPage_') {
                                user.resultsPerPage[settingName.substr(15)] = settingValue;
                            }
                            if (settingName.substr(0, 17) == 'openInFilterMode_') {
                                user.filterModeModules[settingName.substr(17)] = settingValue;
                            }
                        });

                        user.settings = res;

                        var amount;
                        if($rootScope._global.isMobileDevice) {
                            amount = res.phoenix_fo.phoenix_modules_show_mobile;
                        } else {
                            amount = res.phoenix_fo.phoenix_modules_show_desktop;
                        }

                        $rpc('Otys.Services.PhoenixModuleService.get', null,
                            function(res) {
                                user.modules = res.slice(0, amount);
                                user.modulesExtra = res.slice(amount, res.length);

                                if (success != undefined) {
                                    success(user);
                                }

                            },
                            function() {

                                // module list not loaded, proceed anyway

                                if (success != undefined) {
                                    success(user);
                                }

                            }
                        );


                    //    console.log(res);
                        //alert(user.newTabModules);

					},
					null,
					'userSettings'
				);
			}
        };
    }]);

    $provide.factory('$otys', ['$rpc', '$cookies', '$auth', '$cacheFactory', '$timeout', '$modal', '$rootScope', '$q', function ($rpc, $cookies, $auth, $cacheFactory, $timeout, $modal, $rootScope, $q) {
    	
    	// list of services that do not support grouping requests by MultiService
    	var servicesExcludedFromMultiService = [
    	    // example: 'SettingsService'
	    ];
    	
    	var queue = [];

        var executeMultiServiceTimer = null;
    	
    	var executeMultiService = function() {
    		
    		if (queue.length == 0) {
    			return;
    		}
    		
    		/*if (queue.length == 1) {
    			var val = queue[0];
                console.log('Rpcingg', val);
    			$rpc(val[0], val[1], val[2], val[3], val[4], val[5], val[6]);
    			queue = [];
    			return;
    		}*/
    		
    		if (queue.length > 1 || true) {
    			
    			var calls = [];
    			var queueLocal = angular.copy(queue);
    			var hideLoader = true;
    			angular.forEach(queue, function(val) {
    				calls.push({
    					method: val[0],
    					args: val[1]
    				});

                    if(val[6] == undefined || !val[6]) { // When one request has hideLoader false, the multirequest will show the loader
                        hideLoader = false;
                    }                    
    			});
    			
    			$rpc(
    				'Otys.Services.MultiService.execute',
    				[ calls ],
    				function (res) {
    					angular.forEach(res, function (requestResponse, requestIndex) {
    							
    						var subRequest = queueLocal[requestIndex]; 
    						
    						if (true) {
    						
	    						if (requestResponse.status == 'success') {
	    						
	    							// subrequest successful
		    						if (subRequest[4] != null && subRequest[4] != undefined) {
		    							$rpc().putToCache(subRequest[4], requestResponse.data, subRequest[5]);
		    						}
		    						if (subRequest[2] != null && subRequest[2] != undefined) {
		    							subRequest[2](requestResponse.data);
		    						}
	    						
	    						}
	    						else {
	    						
	    							// subrequest failed
		    						if (subRequest[3] != null && subRequest[3] != undefined) {
		    							subRequest[3]({ error: requestResponse });
		    						}
		    						else {
                                        console.log('Remote exception thrown:');
                                        console.log(requestResponse.message);
                                        require(['lib/errors/mapping'], function () {
                                            var errorScope = $rootScope.$new();
                                            var modalPromiseError = $modal({
                                                template: 'partials/errormodal.html',
                                                persist: true,
                                                show: false,
                                                backdrop: 'static',
                                                scope: errorScope,
                                                //controller: $controller('OcdBindCtrl', { $scope: $scope.ocdScope })
                                            });
                                            $q.when(modalPromiseError).then(function(modalEl) {
                                                modalEl.modal('show');
                                                errorScope.errormessage = error_map(requestResponse.message);
                                            });
                                            //alert(error_map(requestResponse.message));
                                        });
                                     //   alert('[[An error has occured|js]]');
		    						}
	    							
	    						}
    						
    						}
    						else {
    							
    							// subrequest successful
	    						if (subRequest[4] != null && subRequest[4] != undefined) {
	    							$rpc().putToCache(subRequest[4], requestResponse, subRequest[5]);
	    						}
	    						if (subRequest[2] != null && subRequest[2] != undefined) {
	    							subRequest[2](requestResponse);
	    						}
    							
    						}
    						
    					});
    				},
    				function (res) {
    					
    					// all requests failed
    					angular.forEach(queueLocal, function (call) {
    						if (call[3] != null && call[3] != undefined) {
    							call[3]();
    						}
    					});

                        console.log('Request failed:');
                        console.log(res);

    				},
                    null,
                    null,
                    hideLoader
    			)
    		
    			queue = [];
    			return;
    		}
    		    		
    	};
    	
        return function (method, params, callback, failure, cacheId, cacheTtl, hideLoader) {

            if (cacheId != undefined && cacheId != null) {
                // generate cache ID automatically to prevent conflicts
                cacheId = angular.toJson([ method, params, cacheTtl ]);
            }

        	var serviceName = method.split('.')[0];
        	
        	var useMultiService = !~servicesExcludedFromMultiService.indexOf(serviceName);        	
        	useMultiService = useMultiService && !$rpc().isCached(cacheId) && (!$cookies['doNotUseMultiService']);

            if (useMultiService) {

                if (hideLoader == undefined || !hideLoader) {
                    // show loader right now, otherwise the loader blinks too much and might cause epileptic seizures to our users
                    $('#loadingSpinner').css('display', 'block');
                }

                // group requests together
        		queue.push([ 'Otys.Services.' + method, [ $auth.getSessionId() ].concat(params), callback, failure, cacheId, cacheTtl, hideLoader ]);

                if (executeMultiServiceTimer) {
                    $timeout.cancel(executeMultiServiceTimer);
                }

                executeMultiServiceTimer = $timeout(executeMultiService, 0);

        	}
        	else {
        		$rpc('Otys.Services.' + method, [ $auth.getSessionId() ].concat(params), callback, failure, cacheId, cacheTtl, hideLoader);
        	}

            return cacheId;
        };
    }]);
    
    /*
    $provide.factory('$otysMultiService', ['$rpc', '$auth', '$cacheFactory', '$otys', function $otysMultiServiceFactory($rpc, $auth, $cacheFactory, $otys) {        
        
    	var cache = $cacheFactory('otysCache');
    	
    	return {
    		
    		_queue: [],
    		
    		queue: function(method, params, callback, failure, cacheId, cacheTtl, hideLoader) {
    			
    			if (cacheId != undefined && cacheId != null) {
            		var result = cache.get(cacheId);
            		if (result != undefined) {
            			$otys(method, params, callback, failure, cacheId, cacheTtl, hideLoader);
            			return;
            		}
            	}
    			
    			this._queue.push([
    			    'Otys.Services.' + method, [ $auth.getSessionId() ].concat(params), callback, failure, cacheId, cacheTtl, hideLoader
    			]);
    			
    		},
    		
    		execute: function() {
    			
    			angular.forEach(this._queue, function(val) {
    				$rpc(val[0], val[1], val[2], val[3], val[4], val[5], val[6]);
    			});
    			
    			this._queue = [];
    			
    		}    		
    		
    	};
    	
    	
    }]);
    */

    $provide.factory('$pagination', function () {
        return function (total, pageLimit, pageNr) {
            return {
                total: total,
                pageNr: pageNr,
                isFirst: pageNr <= 1,
                isLast: pageNr * pageLimit >= total,
                hasPrev: pageNr > 1,
                hasNext: pageNr * pageLimit < total,
                firstRecord: (pageNr - 1) * pageLimit + 1,
                lastRecord: pageNr * pageLimit < total ? pageNr * pageLimit : total,
                pageFirst: 1,
                pageLast: Math.ceil(total / pageLimit),
                pagePrev: pageNr - 1,
                pageNext: pageNr + 1
            }
        };
    });
    
    $provide.factory('$moduleStatus', [ 'DSCacheFactory', function (DSCacheFactory) {    	
    	var cache = DSCacheFactory('moduleStatus', {
            storageMode: 'sessionStorage'
        });    	
    	return cache;
    }]);

	$provide.factory('$titleNotification', [ '$window', '$timeout', function ($window, $timeout) {
		var enabled = false;
		var originalTitle = null;
		var newTitle = null;
		var message = null;
		var timeoutShow = null;
		var timeoutHide = null;
		return {
			enable: function(text) {
				var self = this;				
				if (!enabled) {
					originalTitle = $window.document.title;
				}
				enabled = true;
				if (text != undefined) {
					message = text;
				}				
				var newTitle = '!!! ' + message + ' !!! | OTYS';
				$window.document.title = newTitle;
				$timeout.cancel(timeoutHide);
				$timeout.cancel(timeoutShow);
				timeoutHide = $timeout(function() {
					if ($window.document.title == newTitle) {
						$window.document.title = originalTitle;
					}
					else {
						originalTitle = $window.document.title;
					}
					if (enabled) {
						timeoutShow = $timeout(function() { self.enable(); }, 1000);
					}
				}, 1000);
			},
			disable: function() {
				enabled = false;
			}
		};
	}]);

    $provide.factory('$statistics', ['$timeout', '$otys', function($timeout, $otys){
        var moduleStatistics;
        var timeout;
        var running = false;
        var timeInterval = 1000*60*15;

        var processStatistics = function(success) {
            $otys('PhoenixModuleService.processStatistics', [moduleStatistics], success, function(res){console.log(res)}, null, null, false);
        }


        return {
            'start' : function(){
                if(running){ // Only allow to start if the timeout isn't running
                    return false;
                }
                moduleStatistics = {};
                running = true;
                timeout = $timeout(function run() {
                    // Send the data if object contains statistics, start timeout again
                    if($.isEmptyObject(moduleStatistics)) {
                        timeout = $timeout(run, timeInterval);
                    } else {
                        processStatistics(
                            function() {
                                timeout = $timeout(run, timeInterval); 
                                moduleStatistics = {};
                            }
                        );
                    }
                }, timeInterval);
            },
            'add' : function(moduleName) {
                if(moduleStatistics) {
                    if(!angular.isNumber(moduleStatistics[moduleName])){
                        moduleStatistics[moduleName] = 0;
                    }
                    moduleStatistics[moduleName]++;
                }
            },
            'isRunning' : function() {
                return running;
            },
            'stop' : function() {
                $timeout.cancel(timeout);
                moduleStatistics = {};
                running = false;
            }
        }
    }]);


    $provide.factory('$otysMessageBus', [ '$auth', '$window', '$timeout', 'ngstomp', function ($auth, $window, $timeout, ngstomp) {

        var stompClient = null;
        var connected = false;
        var connecting = false;
        var callbacks = [];

        return {

            connect: function(onConnect) {

                var self = this;

                callbacks.push(onConnect);

                if (connecting) {
                    return;
                }

                if (connected) {
                    onConnect(stompClient);
                    return;
                }

                connecting = true;

                $auth.check(function() {

                    var userId = $auth.getUser().id;
                    var password = $auth.getUser().stompPassword;

                    if (!password) {
                        return;
                    }

                    var config = {
                        url: $window.location.protocol == 'https:' ? 'https://ows.otys.nl:15675/stomp' : 'http://ows.otys.nl:15674/stomp',
                        user: 'otys_user_' + userId,
                        password: password,
                        vhost: '/'
                    };

                    $auth.registerLogoutCallback(self.disconnect);

                    stompClient = ngstomp(config.url);

                    stompClient.connect(
                        config.user,
                        config.password,
                        self._onConnect,
                        self._reconnect,
                        config.vhost
                    );

                });

            },

            disconnect: function() {
                try {
                    stompClient.disconnect(function() {});
                } catch (ex) {
                    console.log(ex);
                }
                connected = false;
                connecting = false;
                stompClient = null;
            },

            _reconnect: function() {
                connected = false;
                connecting = false;
                $timeout(this.connect, Math.floor(Math.random() * 2 * 60 * 1000)); // reconnect again in random interval within next 2 minutes
            },

            _onConnect: function() {

                if (!connecting) {
                    // connecting cancelled because of logout
                    return;
                }

                connecting = false;
                connected = true;

                angular.forEach(callbacks, function(callback) {
                    callback(stompClient);
                });

            }

        };

    }]);

    $provide.factory('$scopeController', ['$rootScope', '$controller', function($rootScope, $controller ){

         return {
             'launch' : function(controllerName) {
                 var xScope = $rootScope.$new();
                 $controller(controllerName, { $scope: xScope });
                 return xScope;
             }
         }

     }]);


   /* $provide.factory('skins', ['$timeout', '$otys', function($timeout, $otys){

        return {
            'start' : function(){
               
            },

        }
    }]);*/


});