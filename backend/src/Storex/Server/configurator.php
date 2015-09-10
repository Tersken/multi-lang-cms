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

        $server->bind('updateFile', 'Storex\Files\FileModel', "update");
        $server->bind('listFiles', 'Storex\Files\FileModel', "listData");
        $server->bind('deleteFile', 'Storex\Files\FileModel', "delete");

    }
}
