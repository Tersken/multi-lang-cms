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
        $server->bind('getPage', 'Storex\Cms\PageModel', "get");
        $server->bind('updatePage', 'Storex\Cms\PageModel', "update");
        $server->bind('insertPage', 'Storex\Cms\PageModel', "insert");
        $server->bind('deletePage', 'Storex\Cms\PageModel', "delete");

        $server->bind('getMenu', 'Storex\Cms\MenuModel', "getMenu");
        $server->bind('saveMenu', 'Storex\Cms\MenuModel', "saveMenu");

        $server->bind('listUsers', 'Storex\Register\UserModel', "listData");
        $server->bind('getUser', 'Storex\Register\UserModel', "get");
        $server->bind('updateUser', 'Storex\Register\UserModel', "update");
        $server->bind('insertUser', 'Storex\Register\UserModel', "insert");
        //$server->bind('myProcedure', 'Api', 'doSomething');
    }
}
