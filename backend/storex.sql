/*
Navicat MySQL Data Transfer

Source Server         : Localhost
Source Server Version : 50518
Source Host           : localhost:3306
Source Database       : storex

Target Server Type    : MYSQL
Target Server Version : 50518
File Encoding         : 65001

Date: 2015-09-10 21:52:38
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `files`
-- ----------------------------
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `access_level` int(10) DEFAULT NULL,
  `time_added` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `userid` int(10) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of files
-- ----------------------------
INSERT INTO `files` VALUES ('10', 'green_kitchen_interio_design6.jpg', 'green_kitchen_interio_design6.jpg', '1', '2015-09-10 20:32:37', '1');
INSERT INTO `files` VALUES ('11', 'Modern-Bookshelf-1.jpg', 'Modern-Bookshelf-1.jpg', '1', '2015-09-10 20:32:37', '1');
INSERT INTO `files` VALUES ('12', 'Cardboard', 'cardboard-furniture2.jpg', '3', '2015-09-10 21:23:07', '1');

-- ----------------------------
-- Table structure for `menu`
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of menu
-- ----------------------------

-- ----------------------------
-- Table structure for `menu_items`
-- ----------------------------
DROP TABLE IF EXISTS `menu_items`;
CREATE TABLE `menu_items` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `target` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `is_module` tinyint(4) NOT NULL DEFAULT '0',
  `menu_uid` int(11) NOT NULL,
  `rank` int(11) NOT NULL,
  `parent_uid` int(11) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of menu_items
-- ----------------------------
INSERT INTO `menu_items` VALUES ('15', '5', '0', '1', '0', '0');
INSERT INTO `menu_items` VALUES ('16', '6', '0', '1', '1', '0');
INSERT INTO `menu_items` VALUES ('17', '1', '0', '1', '2', '0');
INSERT INTO `menu_items` VALUES ('18', '8', '0', '1', '0', '17');
INSERT INTO `menu_items` VALUES ('19', '7', '0', '1', '1', '17');
INSERT INTO `menu_items` VALUES ('20', '10', '0', '1', '2', '17');
INSERT INTO `menu_items` VALUES ('21', '8', '0', '1', '3', '0');

-- ----------------------------
-- Table structure for `pages`
-- ----------------------------
DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages` (
  `pageUid` int(11) NOT NULL AUTO_INCREMENT,
  `language_code` varchar(3) NOT NULL,
  `title` text,
  `body` text,
  `published` tinyint(4) DEFAULT NULL,
  `time_added` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint(4) DEFAULT '0',
  `userid` int(11) DEFAULT NULL,
  PRIMARY KEY (`pageUid`,`language_code`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pages
-- ----------------------------
INSERT INTO `pages` VALUES ('1', 'fr', 'test123aaa', '<p>dawdawdd4564654</p>\n', '1', '2015-08-19 14:04:41', '0', '0');
INSERT INTO `pages` VALUES ('2', 'en', 'tester', '<h3><img alt=\"\" src=\" https://www.hallaminternet.com/assets/URL-tagging-image.png\" style=\"float:left; height:100px; margin-right:10px; width:100px\" />My special title</h3>\n\n<p>some text</p>\n', '1', '2015-08-19 14:37:41', '0', '1');
INSERT INTO `pages` VALUES ('3', 'en', 'qqq', '<p>ddddd</p>\n', '1', '2015-08-17 20:16:17', '0', null);
INSERT INTO `pages` VALUES ('3', 'fr', 'qqq', '<p>ddddd</p>\n', '1', '2015-08-17 20:16:17', '0', null);
INSERT INTO `pages` VALUES ('4', 'en', 'qzdqzd', '<p>qzdzq</p>\n', '1', '2015-08-17 20:19:15', '0', null);
INSERT INTO `pages` VALUES ('5', 'en', 'qzdqzd', '<p>qzdzq</p>\n', '1', '2015-08-17 20:19:20', '0', null);
INSERT INTO `pages` VALUES ('6', 'en', '132', '<p>yterqzsdzq</p>\n', '1', '2015-08-17 20:20:51', '0', null);
INSERT INTO `pages` VALUES ('7', 'en', 'zdqdqzd', '<p>zzzzzzzzzz</p>\n', '1', '2015-08-17 20:22:26', '0', null);
INSERT INTO `pages` VALUES ('8', 'en', 'te', '<p>ddddddddddddd</p>\n', '1', '2015-08-17 20:24:38', '0', null);
INSERT INTO `pages` VALUES ('9', 'en', 'test', '<p>dzqdqzdzqd</p>\n', '1', '2015-08-17 20:25:14', '0', null);
INSERT INTO `pages` VALUES ('10', 'en', 'dzqdzd', '<p>qzdzqd</p>\n', '1', '2015-08-17 20:25:46', '0', null);
INSERT INTO `pages` VALUES ('10', 'fr', 'dzqdzd', '<p>qzdzqd</p>\n', '1', '2015-08-17 20:25:46', '0', null);
INSERT INTO `pages` VALUES ('11', 'nl', 'test NL', '<!-- Dit is de naajr -->\n<p>// main page location 1</p>\n\n<p>&nbsp;</p>\n\n<p>TEST NL</p>\n', '1', '2015-09-07 17:37:58', '0', '1');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `access_level` int(10) NOT NULL,
  `time_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'test', '098f6bcd4621d373cade4e832627b4f6', 'kwatta@test.be', '10', '2015-08-14 15:35:56');
