CREATE DATABASE  IF NOT EXISTS `electionsdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `electionsdb`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: electionsdb
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ballot`
--

DROP TABLE IF EXISTS `ballot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ballot` (
  `ballot_id` varchar(255) NOT NULL,
  `charge_id` int NOT NULL,
  `election_date` date NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `winnerCandidate_id` int DEFAULT '0',
  `totalVotes` int DEFAULT '0',
  `anuledVotes` int DEFAULT '0',
  PRIMARY KEY (`ballot_id`),
  KEY `FK_Ballot_Candidate` (`winnerCandidate_id`),
  KEY `fk_charge_id` (`charge_id`),
  CONSTRAINT `fk_ballotcharge_charge_id` FOREIGN KEY (`charge_id`) REFERENCES `charge` (`charge_id`),
  CONSTRAINT `fk_charge_id` FOREIGN KEY (`charge_id`) REFERENCES `charge` (`charge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ballot`
--

LOCK TABLES `ballot` WRITE;
/*!40000 ALTER TABLE `ballot` DISABLE KEYS */;
INSERT  IGNORE INTO `ballot` VALUES ('AGS3BABDCC',3,'2023-10-28',1,0,0,0);
INSERT  IGNORE INTO `ballot` VALUES ('AGS3BCAAEA',3,'2023-10-28',1,0,0,0);
INSERT  IGNORE INTO `ballot` VALUES ('AGS3BCBAAD',3,'2023-10-28',1,1,0,0);
INSERT  IGNORE INTO `ballot` VALUES ('AGS3CCDEFC',3,'2023-10-28',1,0,0,0);
INSERT  IGNORE INTO `ballot` VALUES ('AGS4DBFADA',4,'2023-10-28',1,0,0,0);
INSERT  IGNORE INTO `ballot` VALUES ('AGS5FEDDFE',5,'2023-10-28',1,0,0,0);
INSERT  IGNORE INTO `ballot` VALUES ('AGS6CDACFE',6,'2023-10-28',1,0,0,0);
/*!40000 ALTER TABLE `ballot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ballot_candidate`
--

DROP TABLE IF EXISTS `ballot_candidate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ballot_candidate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ballot_id` varchar(255) DEFAULT NULL,
  `candidate_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ballot_id` (`ballot_id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `ballot_candidate_ibfk_1` FOREIGN KEY (`ballot_id`) REFERENCES `ballot` (`ballot_id`),
  CONSTRAINT `ballot_candidate_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `candidate` (`candidate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ballot_candidate`
--

LOCK TABLES `ballot_candidate` WRITE;
/*!40000 ALTER TABLE `ballot_candidate` DISABLE KEYS */;
INSERT  IGNORE INTO `ballot_candidate` VALUES (1,'AGS3BCBAAD',1);
INSERT  IGNORE INTO `ballot_candidate` VALUES (3,'AGS3CCDEFC',5);
INSERT  IGNORE INTO `ballot_candidate` VALUES (4,'AGS3CCDEFC',6);
INSERT  IGNORE INTO `ballot_candidate` VALUES (5,'AGS3CCDEFC',7);
INSERT  IGNORE INTO `ballot_candidate` VALUES (6,'AGS3BABDCC',8);
INSERT  IGNORE INTO `ballot_candidate` VALUES (7,'AGS3BABDCC',9);
INSERT  IGNORE INTO `ballot_candidate` VALUES (8,'AGS3BABDCC',10);
INSERT  IGNORE INTO `ballot_candidate` VALUES (9,'AGS3BCAAEA',11);
INSERT  IGNORE INTO `ballot_candidate` VALUES (10,'AGS3BCAAEA',12);
INSERT  IGNORE INTO `ballot_candidate` VALUES (11,'AGS3BCAAEA',13);
INSERT  IGNORE INTO `ballot_candidate` VALUES (12,'AGS4DBFADA',14);
INSERT  IGNORE INTO `ballot_candidate` VALUES (13,'AGS4DBFADA',15);
INSERT  IGNORE INTO `ballot_candidate` VALUES (14,'AGS4DBFADA',16);
INSERT  IGNORE INTO `ballot_candidate` VALUES (15,'AGS6CDACFE',17);
INSERT  IGNORE INTO `ballot_candidate` VALUES (16,'AGS6CDACFE',18);
INSERT  IGNORE INTO `ballot_candidate` VALUES (17,'AGS6CDACFE',19);
INSERT  IGNORE INTO `ballot_candidate` VALUES (18,'AGS5FEDDFE',20);
INSERT  IGNORE INTO `ballot_candidate` VALUES (19,'AGS5FEDDFE',21);
INSERT  IGNORE INTO `ballot_candidate` VALUES (20,'AGS5FEDDFE',22);
/*!40000 ALTER TABLE `ballot_candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate`
--

DROP TABLE IF EXISTS `candidate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate` (
  `candidate_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `first_lastname` varchar(255) NOT NULL,
  `second_lastname` varchar(255) NOT NULL,
  `pseudonym` varchar(255) NOT NULL,
  `party_id` int NOT NULL,
  `enable` tinyint(1) DEFAULT '1',
  `status` tinyint(1) DEFAULT '0',
  `totalVotes` int DEFAULT '0',
  PRIMARY KEY (`candidate_id`),
  KEY `fk_candidate_party` (`party_id`),
  CONSTRAINT `fk_candidate_party` FOREIGN KEY (`party_id`) REFERENCES `political_party` (`party_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate`
--

LOCK TABLES `candidate` WRITE;
/*!40000 ALTER TABLE `candidate` DISABLE KEYS */;
INSERT  IGNORE INTO `candidate` VALUES (1,'Maria Teresa','Jimenez','Esquivel','Tere Jimenez',1,1,1,0);
INSERT  IGNORE INTO `candidate` VALUES (5,'Maria','Garcia','Lopez','MGL',1,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (6,'Juan','Perez','Gomez','JPG',2,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (7,'Ana','Martinez','Rodriguez','AMR',3,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (8,'Maria','Garcia','Lopez','MGL',1,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (9,'Juan','Perez','Gomez','JPG',2,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (10,'Ana','Martinez','Rodriguez','AMR',3,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (11,'Maria','Garcia','Lopez','MGL',1,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (12,'Juan','Perez','Gomez','JPG',2,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (13,'Ana','Martinez','Rodriguez','AMR',3,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (14,'Maria','Garcia','Lopez','MGL',1,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (15,'Juan','Perez','Gomez','JPG',2,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (16,'Ana','Martinez','Rodriguez','AMR',3,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (17,'Maria','Garcia','Lopez','MGL',1,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (18,'Juan','Perez','Gomez','JPG',2,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (19,'Ana','Martinez','Rodriguez','AMR',3,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (20,'Maria','Garcia','Lopez','MGL',1,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (21,'Juan','Perez','Gomez','JPG',2,1,0,0);
INSERT  IGNORE INTO `candidate` VALUES (22,'Ana','Martinez','Rodriguez','AMR',3,1,0,0);
/*!40000 ALTER TABLE `candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `charge`
--

DROP TABLE IF EXISTS `charge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `charge` (
  `charge_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`charge_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charge`
--

LOCK TABLES `charge` WRITE;
/*!40000 ALTER TABLE `charge` DISABLE KEYS */;
INSERT  IGNORE INTO `charge` VALUES (1,'Presidencia');
INSERT  IGNORE INTO `charge` VALUES (2,'Gubernatura');
INSERT  IGNORE INTO `charge` VALUES (3,'Alcaldía');
INSERT  IGNORE INTO `charge` VALUES (4,'Diputación Federal');
INSERT  IGNORE INTO `charge` VALUES (5,'Diputación Local');
INSERT  IGNORE INTO `charge` VALUES (6,'Senaduría');
/*!40000 ALTER TABLE `charge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `election_exercise`
--

DROP TABLE IF EXISTS `election_exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `election_exercise` (
  `exercise_id` varchar(255) NOT NULL,
  `election_type_id` int NOT NULL,
  `state_id` int NOT NULL,
  `date` date NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  `enable` tinyint(1) DEFAULT '1',
  `ballots_ids` text,
  `expected_votes` int DEFAULT '0',
  PRIMARY KEY (`exercise_id`),
  KEY `election_type_id` (`election_type_id`),
  KEY `state_id` (`state_id`),
  CONSTRAINT `election_exercise_ibfk_1` FOREIGN KEY (`election_type_id`) REFERENCES `election_type` (`election_type_id`),
  CONSTRAINT `election_exercise_ibfk_2` FOREIGN KEY (`state_id`) REFERENCES `state` (`state_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `election_exercise`
--

LOCK TABLES `election_exercise` WRITE;
/*!40000 ALTER TABLE `election_exercise` DISABLE KEYS */;
INSERT  IGNORE INTO `election_exercise` VALUES ('AGS1DBFFAC',1,1,'2025-08-28',0,1,NULL,2);
INSERT  IGNORE INTO `election_exercise` VALUES ('BC1CCGFDGD',1,2,'2025-08-28',0,1,NULL,0);
INSERT  IGNORE INTO `election_exercise` VALUES ('GTO1ACFFFB',1,11,'2025-08-28',0,1,NULL,0);
/*!40000 ALTER TABLE `election_exercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `election_exercise_ballot`
--

DROP TABLE IF EXISTS `election_exercise_ballot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `election_exercise_ballot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ballot_id` varchar(255) DEFAULT NULL,
  `exercise_id` varchar(255) DEFAULT NULL,
  `charge_id` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ballot_id` (`ballot_id`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `election_exercise_ballot_ibfk_1` FOREIGN KEY (`ballot_id`) REFERENCES `ballot` (`ballot_id`),
  CONSTRAINT `election_exercise_ballot_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `election_exercise` (`exercise_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `election_exercise_ballot`
--

LOCK TABLES `election_exercise_ballot` WRITE;
/*!40000 ALTER TABLE `election_exercise_ballot` DISABLE KEYS */;
INSERT  IGNORE INTO `election_exercise_ballot` VALUES (3,'AGS3CCDEFC','AGS1DBFFAC',0);
INSERT  IGNORE INTO `election_exercise_ballot` VALUES (5,'AGS3BABDCC','AGS1DBFFAC',0);
INSERT  IGNORE INTO `election_exercise_ballot` VALUES (6,'AGS3BCAAEA','AGS1DBFFAC',3);
INSERT  IGNORE INTO `election_exercise_ballot` VALUES (7,'AGS4DBFADA','AGS1DBFFAC',4);
INSERT  IGNORE INTO `election_exercise_ballot` VALUES (8,'AGS6CDACFE','AGS1DBFFAC',6);
INSERT  IGNORE INTO `election_exercise_ballot` VALUES (9,'AGS5FEDDFE','AGS1DBFFAC',5);
/*!40000 ALTER TABLE `election_exercise_ballot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `election_type`
--

DROP TABLE IF EXISTS `election_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `election_type` (
  `election_type_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`election_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `election_type`
--

LOCK TABLES `election_type` WRITE;
/*!40000 ALTER TABLE `election_type` DISABLE KEYS */;
INSERT  IGNORE INTO `election_type` VALUES (1,'ordinaria');
INSERT  IGNORE INTO `election_type` VALUES (2,'extraordinaria');
/*!40000 ALTER TABLE `election_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elector`
--

DROP TABLE IF EXISTS `elector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elector` (
  `elector_id` char(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `first_lastname` varchar(255) DEFAULT NULL,
  `second_lastname` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `outer_number` varchar(10) DEFAULT NULL,
  `interior_number` varchar(10) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `state_id` int DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `enable` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`elector_id`),
  KEY `fk_electorstate_state_id` (`state_id`),
  CONSTRAINT `fk_electorstate_state_id` FOREIGN KEY (`state_id`) REFERENCES `state` (`state_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elector`
--

LOCK TABLES `elector` WRITE;
/*!40000 ALTER TABLE `elector` DISABLE KEYS */;
INSERT  IGNORE INTO `elector` VALUES ('BARH152001ANMSQB','Andrea Fernanda','Barco','Heredia','2001-08-16','Ignacio Allende','120','-','20286',11,'https://example.com/picture.jpg','M','brayan.vazquez@example.com',1);
INSERT  IGNORE INTO `elector` VALUES ('PERG311989JUUYVC','Juan','Perez','Garcia','1990-01-01','Calle Principal','123','B','12345',1,'https://example.com/picture.jpg','M','juan.perez@example.com',1);
INSERT  IGNORE INTO `elector` VALUES ('VAZH152001BROAJF','Brayan Ulises','Vázquez','Heredia','2001-08-16','Ignacio Allende','120','-','20286',1,'https://example.com/picture.jpg','M','brayan.vazquez@example.com',1);
/*!40000 ALTER TABLE `elector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercise_elector_vote`
--

DROP TABLE IF EXISTS `exercise_elector_vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise_elector_vote` (
  `exercise_elector_vote_id` int NOT NULL AUTO_INCREMENT,
  `elector_id` char(20) NOT NULL,
  `exercise_id` varchar(255) NOT NULL,
  PRIMARY KEY (`exercise_elector_vote_id`),
  KEY `elector_id` (`elector_id`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `exercise_elector_vote_ibfk_1` FOREIGN KEY (`elector_id`) REFERENCES `elector` (`elector_id`),
  CONSTRAINT `exercise_elector_vote_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `election_exercise` (`exercise_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise_elector_vote`
--

LOCK TABLES `exercise_elector_vote` WRITE;
/*!40000 ALTER TABLE `exercise_elector_vote` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercise_elector_vote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `political_party`
--

DROP TABLE IF EXISTS `political_party`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `political_party` (
  `party_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `acronym` varchar(255) DEFAULT NULL,
  `foundation` date DEFAULT NULL,
  `img_logo` varchar(255) DEFAULT NULL,
  `color_hdx` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`party_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `political_party`
--

LOCK TABLES `political_party` WRITE;
/*!40000 ALTER TABLE `political_party` DISABLE KEYS */;
INSERT  IGNORE INTO `political_party` VALUES (1,'Partido Accion Nacional','PAN','1939-11-01','https://example.com/logo.png','#FF0000',1);
INSERT  IGNORE INTO `political_party` VALUES (2,'Partido Nuevo','PN','2022-01-01','https://example.com/logo.png','#FF0000',1);
INSERT  IGNORE INTO `political_party` VALUES (3,'Movimiento de Regeneración Nacional','MORENA','2022-01-01','https://example.com/logo.png','#FF0000',1);
/*!40000 ALTER TABLE `political_party` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `state` (
  `state_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `acronym` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state`
--

LOCK TABLES `state` WRITE;
/*!40000 ALTER TABLE `state` DISABLE KEYS */;
INSERT  IGNORE INTO `state` VALUES (1,'Aguascalientes','AGS');
INSERT  IGNORE INTO `state` VALUES (2,'Baja California','BC');
INSERT  IGNORE INTO `state` VALUES (3,'Baja California Sur','BCS');
INSERT  IGNORE INTO `state` VALUES (4,'Campeche','CAM');
INSERT  IGNORE INTO `state` VALUES (5,'Chiapas','CHIS');
INSERT  IGNORE INTO `state` VALUES (6,'Chihuahua','CHIH');
INSERT  IGNORE INTO `state` VALUES (7,'Ciudad de México','CDMX');
INSERT  IGNORE INTO `state` VALUES (8,'Coahuila','COAH');
INSERT  IGNORE INTO `state` VALUES (9,'Colima','COL');
INSERT  IGNORE INTO `state` VALUES (10,'Durango','DGO');
INSERT  IGNORE INTO `state` VALUES (11,'Guanajuato','GTO');
INSERT  IGNORE INTO `state` VALUES (12,'Guerrero','GRO');
INSERT  IGNORE INTO `state` VALUES (13,'Hidalgo','HGO');
INSERT  IGNORE INTO `state` VALUES (14,'Jalisco','JAL');
INSERT  IGNORE INTO `state` VALUES (15,'México','MEX');
INSERT  IGNORE INTO `state` VALUES (16,'Michoacán','MICH');
INSERT  IGNORE INTO `state` VALUES (17,'Morelos','MOR');
INSERT  IGNORE INTO `state` VALUES (18,'Nayarit','NAY');
INSERT  IGNORE INTO `state` VALUES (19,'Nuevo León','NL');
INSERT  IGNORE INTO `state` VALUES (20,'Oaxaca','OAX');
INSERT  IGNORE INTO `state` VALUES (21,'Puebla','PUE');
INSERT  IGNORE INTO `state` VALUES (22,'Querétaro','QRO');
INSERT  IGNORE INTO `state` VALUES (23,'Quintana Roo','QR');
INSERT  IGNORE INTO `state` VALUES (24,'San Luis Potosí','SLP');
INSERT  IGNORE INTO `state` VALUES (25,'Sinaloa','SIN');
INSERT  IGNORE INTO `state` VALUES (26,'Sonora','SON');
INSERT  IGNORE INTO `state` VALUES (27,'Tabasco','TAB');
INSERT  IGNORE INTO `state` VALUES (28,'Tamaulipas','TAMS');
INSERT  IGNORE INTO `state` VALUES (29,'Tlaxcala','TLAX');
INSERT  IGNORE INTO `state` VALUES (30,'Veracruz','VER');
INSERT  IGNORE INTO `state` VALUES (31,'Yucatán','YUC');
INSERT  IGNORE INTO `state` VALUES (32,'Zacatecas','ZAC');
/*!40000 ALTER TABLE `state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` varchar(255) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `first_lastname` varchar(255) DEFAULT NULL,
  `second_lastname` varchar(255) DEFAULT NULL,
  `user_type` int DEFAULT '0',
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `verified_account` tinyint(1) DEFAULT '0',
  `enable` tinyint(1) DEFAULT '1',
  `electorPermission` tinyint(1) DEFAULT '0',
  `candidatePermission` tinyint(1) DEFAULT '0',
  `ballotPermission` tinyint(1) DEFAULT '0',
  `excercisePermission` tinyint(1) DEFAULT '0',
  `politicalPartyPermission` tinyint(1) DEFAULT '0',
  `usersPermission` tinyint(1) DEFAULT '0',
  `verificateElectorPermission` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`),
  KEY `fk_userType_user_type` (`user_type`),
  CONSTRAINT `fk_userType_user_type` FOREIGN KEY (`user_type`) REFERENCES `user_type` (`user_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT  IGNORE INTO `user` VALUES ('AKAHMEYL','Brqayan','Vazquez','Heredia',1,'$2b$10$zQXvIPddP2YNP5Sa8Uw8wubtI0NUpSGdFIR2PCtBI3GqWkr8Rzs0i','brayanvazq1608@gmail.com',0,1,0,1,1,1,1,1,0);
INSERT  IGNORE INTO `user` VALUES ('COXNNACA','Andreea','Barco','Soto',1,'$2b$10$syo6BHjlLz6ZVtWPaeuXluF.FgKFBtn/nyaqjNBlD6ZtiUjLGR0Yi','brayanvazq1608@gmail.com',1,1,0,1,1,1,1,1,0);
INSERT  IGNORE INTO `user` VALUES ('CPDAFELF','Brqayan','Vazqueez','Heredhia',1,'$2b$10$Yrs6vw8knvQ7B9RrsaW8.u/RE2ypOG84Y1f0osIZoFtNJkY1hk.BK','brayanvazq1608@gmail.com',0,1,0,1,1,1,1,1,0);
INSERT  IGNORE INTO `user` VALUES ('EEMWMLMS','Andrea','Barco','Soto',1,'$2b$10$TGonUYyMFpYV383hHFW1luBV3YCjLlSvJsoY8UPXTd1.I3apwHIRi','brayanvazq1608@gmail.com',1,1,0,1,1,1,1,1,0);
INSERT  IGNORE INTO `user` VALUES ('FJDDOKJV','admin','admin','admin',1,'$2b$10$siLEhkLcjbXqNlDpqMni1eY8YEZYFo03rLbCwOtyYbpFBdxwnSR0a','admin',1,1,1,1,1,1,1,1,1);
INSERT  IGNORE INTO `user` VALUES ('NTJSMYMP','Brayan','Vazquez','Heredia',1,'$2b$10$FCnZKvgykMLjgfT/qBYCNe/89tdc1ReMPh9x0R8hisMN4wSkD7Aki','brayanvazq1608@gmail.com',0,1,0,1,1,1,1,1,0);
INSERT  IGNORE INTO `user` VALUES ('WDCZTFDU','Brqayan','Vazqueez','Heredia',1,'$2b$10$gnc0PYKF5oPXgGrtxUtWEeH6f.NoNVcIrjhDkiymAgIpm6DB.R7Jq','brayanvazq1608@gmail.com',0,1,0,1,1,1,1,1,0);
INSERT  IGNORE INTO `user` VALUES ('WRMRMAMF','Brayan Ulises','Vazquez','Heredia',1,'$2b$10$1nG0tSOQg4NYf1wAL8aM8ORNft4aN.PoPo4JxMpNWSiHL0Gvc/kgG','brayanvazq1608@gmail.com',0,1,0,1,1,1,1,1,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_type` (
  `user_type_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT  IGNORE INTO `user_type` VALUES (1,'Administrador Sr.');
INSERT  IGNORE INTO `user_type` VALUES (2,'Administrador Jr.');
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
