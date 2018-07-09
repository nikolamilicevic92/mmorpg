CREATE DATABASE  IF NOT EXISTS `game` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `game`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: game
-- ------------------------------------------------------
-- Server version	5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ability`
--

DROP TABLE IF EXISTS `ability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ability` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `description` text NOT NULL,
  `sprite` varchar(40) DEFAULT NULL,
  `cooldown` int(11) DEFAULT NULL,
  `damage` int(11) DEFAULT NULL,
  `_range` int(11) DEFAULT NULL,
  `speed` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `sound` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ability`
--

LOCK TABLES `ability` WRITE;
/*!40000 ALTER TABLE `ability` DISABLE KEYS */;
INSERT INTO `ability` VALUES (6,'Sword throw','Throws a sword towards cursor location','warrior-aa.png',1,3,300,3,40,20,'warrior-aa.wav'),(7,'Fireball','Throws a fireball towards cursor location','sorc-aa.png',1,2,250,3,30,24,'sorc-aa.wav'),(8,'Arrow','Fires an arrow towards cursor location','Ardentryst-arrow1.png',1,2,300,3,40,40,'archer-aa.ogg'),(9,'Double arrow','Fires two arrows towards cursor location','Ardentryst-arrow2.png',5,4,300,4,40,40,'archer-aa.ogg'),(10,'Super arrow','Fires a powerfull arrow towards cursor location','Ardentryst-arrow3.png',30,10,300,4,40,40,'archer-aa.ogg'),(11,'Energy ball','Throws an energy ball towards cursor location','healer-aa.png',1,1,300,3,50,50,'healer-aa.mp3'),(12,'Shuriken','Throws a shuriken towards cursor location','ninja-aa.png',1,1,300,5,40,40,'ninja-aa.wav'),(13,'Block','Any damage taken is reduced to 0 while the ability is active','warrior-aura.png',3,0,0,0,72,72,'/'),(14,'Lightning bolt','Spawns a lightning bolt at the cursor location, damaging nearby enemies','spell_bluetop_1_1.png',5,5,400,0,98,203,'sorc-bolt.mp3'),(15,'Healing orb','Spawns a healing orb at cursor location, restores 20% of max HP when picked up','healing-orb.png',1,0,500,0,50,50,'heal.ogg'),(16,'Self heal','Restores 30% of your max health','warrior-a3.png',10,0,0,0,0,0,'heal.ogg');
/*!40000 ALTER TABLE `ability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dragon`
--

DROP TABLE IF EXISTS `dragon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dragon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_dragon_type` int(11) NOT NULL,
  `default_animation` int(11) NOT NULL,
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_dragon_type_idx` (`id_dragon_type`),
  KEY `fk_default_animation_idx` (`default_animation`),
  CONSTRAINT `fk_default_animation` FOREIGN KEY (`default_animation`) REFERENCES `dragon_animation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_id_dragon_type` FOREIGN KEY (`id_dragon_type`) REFERENCES `dragon_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dragon`
--

LOCK TABLES `dragon` WRITE;
/*!40000 ALTER TABLE `dragon` DISABLE KEYS */;
INSERT INTO `dragon` VALUES (42,1,1,1168,9713),(43,2,1,1873,9714),(44,1,4,2322,9042),(45,2,3,1072,9040),(46,1,2,274,9041),(47,2,4,2257,8336),(48,1,2,237,8238),(49,1,2,722,7569),(50,2,3,1712,7725),(51,1,3,1968,7728),(52,3,2,4305,8308),(53,3,1,4913,8114),(54,3,4,5776,8433),(55,3,4,5777,7889),(56,3,1,5263,7504),(57,3,3,3632,7501),(58,3,3,4080,7501),(59,3,3,4080,7824),(60,3,3,3632,7825),(61,4,3,3841,7615);
/*!40000 ALTER TABLE `dragon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dragon_animation`
--

DROP TABLE IF EXISTS `dragon_animation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dragon_animation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) DEFAULT NULL,
  `coordinates` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dragon_animation`
--

LOCK TABLES `dragon_animation` WRITE;
/*!40000 ALTER TABLE `dragon_animation` DISABLE KEYS */;
INSERT INTO `dragon_animation` VALUES (1,'fly-up','[[144, 0], [288, 0], [144, 0], [0, 0]]'),(2,'fly-right','[[144, 124], [288, 124], [144, 124], [0, 124]]'),(3,'fly-down','[[144, 248], [288, 248], [144, 248], [0, 248]]'),(4,'fly-left','[[144, 372], [288, 372], [144, 372], [0, 372]]');
/*!40000 ALTER TABLE `dragon_animation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dragon_type`
--

DROP TABLE IF EXISTS `dragon_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dragon_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) DEFAULT NULL,
  `sprite` varchar(40) NOT NULL,
  `max_health` int(11) NOT NULL,
  `a1_cooldown` int(11) NOT NULL,
  `a1_speed` int(11) NOT NULL,
  `a1_range` int(11) NOT NULL,
  `experience_worth` int(11) NOT NULL,
  `gold_worth` int(11) NOT NULL,
  `respawn_timer` int(11) NOT NULL,
  `a1_damage` int(11) NOT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dragon_type`
--

LOCK TABLES `dragon_type` WRITE;
/*!40000 ALTER TABLE `dragon_type` DISABLE KEYS */;
INSERT INTO `dragon_type` VALUES (1,'level 1 red','flying_dragon-red.png',1300,2000,3,250,300,21,3,200,144,124),(2,'level 1 gold','flying_dragon-gold.png',1500,1500,2,300,100,100,15,200,144,124),(3,'level 2 red','flying_twin_headed_dragon-red.png',2000,1400,3,300,200,200,30,250,144,124),(4,'level 2 blue','flying_twin_headed_dragon-blue.png',2200,1400,3,300,200,200,30,250,144,124);
/*!40000 ALTER TABLE `dragon_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero`
--

DROP TABLE IF EXISTS `hero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hero` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_player` int(11) NOT NULL,
  `id_quest` int(11) NOT NULL DEFAULT '1',
  `id_hero_type` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `level` int(11) NOT NULL DEFAULT '1',
  `experience` int(11) NOT NULL DEFAULT '0',
  `health` int(11) NOT NULL,
  `gold` int(11) NOT NULL DEFAULT '0',
  `X` int(11) NOT NULL DEFAULT '200',
  `Y` int(11) NOT NULL DEFAULT '9600',
  `won` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_id_player_idx` (`id_player`),
  KEY `fk_id_quest_idx` (`id_quest`),
  KEY `fk_id_hero_type_idx` (`id_hero_type`),
  CONSTRAINT `fk_id_hero_type` FOREIGN KEY (`id_hero_type`) REFERENCES `hero_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_id_player` FOREIGN KEY (`id_player`) REFERENCES `player` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_id_quest` FOREIGN KEY (`id_quest`) REFERENCES `quest` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero`
--

LOCK TABLES `hero` WRITE;
/*!40000 ALTER TABLE `hero` DISABLE KEYS */;
INSERT INTO `hero` VALUES (12,9,1,7,'Ninja123',1,1400,900,278,5668,8741,0),(13,9,1,9,'Ranger123',1,900,950,209,3047,1755,0),(15,9,1,1,'Test',1,400,1187,120,2570,9478,0),(16,9,1,5,'Test1',2,300,1350,121,1782,9451,0),(17,10,1,9,'Test2',1,300,950,21,379,9471,0),(18,9,1,4,'Test3',1,0,800,0,576,9647,0),(19,11,1,5,'B',1,600,850,37,577,9326,0);
/*!40000 ALTER TABLE `hero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero_type`
--

DROP TABLE IF EXISTS `hero_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hero_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(40) NOT NULL,
  `sprite` varchar(40) NOT NULL,
  `base_attack` int(11) NOT NULL,
  `base_defence` int(11) NOT NULL,
  `base_mobility` int(11) NOT NULL,
  `base_health` int(11) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero_type`
--

LOCK TABLES `hero_type` WRITE;
/*!40000 ALTER TABLE `hero_type` DISABLE KEYS */;
INSERT INTO `hero_type` VALUES (1,'Warrior (male)','warrior_m.png',40,70,45,1200,'Warrior (male) lorem ipsum dolor sit amet'),(2,'Warrior (female)','warrior_f.png',45,65,50,1100,'Warrior (female) lorem ipsum dolor sit amet'),(3,'Healer (male)','healer_m.png',30,30,60,850,'Healer(male) lorem ipsum dolor sit amet'),(4,'Healer (female)','healer_f.png',25,25,65,800,'Healer (female) lorem ipsum dolor sit amet'),(5,'Mage (male)','mage_m.png',90,30,50,850,'Mage (male) lorem ipsum dolor sit amet'),(6,'Mage (female)','mage_f.png',85,25,55,800,'Mage (female) lorem ipsum dolor sit amet'),(7,'Ninja (male)','ninja_m.png',75,40,85,900,'Ninja (male) lorem ipsum dolor sit amet'),(8,'Ninja (female)','ninja_f.png',70,35,90,850,'Ninja (female) lorem ipsum dolor sit amet'),(9,'Ranger (male)','ranger_m.png',80,45,70,950,'Ranger (male) lorem ipsum dolor sit amet'),(10,'Ranger (female)','ranger_f.png',75,40,75,905,'Ranger (female) lorem ipsum dolor sit amet');
/*!40000 ALTER TABLE `hero_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero_type_abilities`
--

DROP TABLE IF EXISTS `hero_type_abilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hero_type_abilities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_hero_type2` int(11) NOT NULL,
  `id_ability` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_hero_type_idx` (`id_hero_type2`),
  KEY `fk_id_ability_idx` (`id_ability`),
  CONSTRAINT `fk_id_ability` FOREIGN KEY (`id_ability`) REFERENCES `ability` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_id_hero_type2` FOREIGN KEY (`id_hero_type2`) REFERENCES `hero_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero_type_abilities`
--

LOCK TABLES `hero_type_abilities` WRITE;
/*!40000 ALTER TABLE `hero_type_abilities` DISABLE KEYS */;
INSERT INTO `hero_type_abilities` VALUES (31,1,6),(36,1,8),(39,2,6),(40,2,8),(42,2,12),(43,3,11),(44,3,10),(45,3,12),(46,4,11),(49,5,7),(50,6,7),(52,6,10),(53,5,12),(54,6,12),(55,7,12),(56,8,12),(57,7,6),(58,8,6),(59,7,8),(60,8,8),(61,9,8),(62,10,8),(63,9,9),(64,10,9),(65,9,10),(66,10,10),(67,1,13),(68,5,14),(69,4,15),(70,4,16);
/*!40000 ALTER TABLE `hero_type_abilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player`
--

DROP TABLE IF EXISTS `player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(40) NOT NULL,
  `username` varchar(40) NOT NULL,
  `password` varchar(255) NOT NULL,
  `char_slots` int(11) NOT NULL,
  `logged_in` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player`
--

LOCK TABLES `player` WRITE;
/*!40000 ALTER TABLE `player` DISABLE KEYS */;
INSERT INTO `player` VALUES (9,'nikolamilicevic92@gmail.com','nikolamilicevic','827ccb0eea8a706c4c34a16891f84e7b',0,0),(10,'a','a','a',1,0),(11,'b','b','92eb5ffee6ae2fec3ad71c777531578f',1,0);
/*!40000 ALTER TABLE `player` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quest`
--

DROP TABLE IF EXISTS `quest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `experience` int(11) NOT NULL,
  `gold` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `dragon` varchar(45) NOT NULL,
  `amount` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quest`
--

LOCK TABLES `quest` WRITE;
/*!40000 ALTER TABLE `quest` DISABLE KEYS */;
INSERT INTO `quest` VALUES (1,'Kill a couple of level 1 gold dragons to get you started',100,27,'Initial quest','level 1 gold',7);
/*!40000 ALTER TABLE `quest` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-07-09 14:21:41
