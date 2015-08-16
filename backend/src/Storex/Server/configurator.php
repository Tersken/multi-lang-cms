<?php
namespace Storex\Server;
use Storex\Auth\Authentication,
    Storex\Cms\PageModel;
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
        // Bind the method Api::doSomething() to the procedure myProcedure
        $server->bind('listPages', 'Storex\Cms\PageModel', "listData");
        //$server->bind('myProcedure', 'Api', 'doSomething');
    }
}
