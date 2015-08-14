<?php
namespace Storex\Server;
use Storex\Auth\Authentication;
/**
 * Description of Configurator
 *
 * @author koen.tersago
 */
class Configurator {
    public static function configure($server){
        $server->register('sayHello', function ($name) {
            return "Hello $name";
        });
        
        $server->attach(new Authentication);
        //$server->bind('myProcedure', 'Api', 'doSomething');
    }
}
