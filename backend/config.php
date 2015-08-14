<?php
use Storex\Connection\Database;
session_start();
$opt = array();
$opt['host'] = "localhost";
$opt['user'] = "root";
$opt['password'] = "";
$opt['database'] = "storex";
Database::setOptions($opt);
