CREATE DATABASE  IF NOT EXISTS `hotel_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hotel_db`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel_db
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `hotel`
--

DROP TABLE IF EXISTS `hotel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel` (
  `price` varchar(255) DEFAULT NULL,
  `star_rating` int DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `capacity` varchar(255) DEFAULT NULL,
  `max_capacity` int DEFAULT '2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel`
--

LOCK TABLES `hotel` WRITE;
/*!40000 ALTER TABLE `hotel` DISABLE KEYS */;
INSERT INTO `hotel` VALUES ('888-1288',5,1,'Hotel A','Street 1',NULL,'1-4',4),('788-1188',4,2,'Hotel B','Street 2',NULL,'1-2',2),('988-1588',4,3,'Hotel C','Street 3',NULL,'1-5',5),('588-688',3,4,'Hotel D','Street 4',NULL,'1-3',3),('188-358',2,5,'Hotel E','Street 5',NULL,'1-2',2);
/*!40000 ALTER TABLE `hotel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) DEFAULT NULL,
  `hotel_id` bigint NOT NULL,
  `room_id` bigint NOT NULL,
  `status` varchar(255) NOT NULL,
  `total_price` double NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `hotel_name` varchar(255) DEFAULT NULL,
  `room_type` varchar(255) DEFAULT NULL,
  `complete_time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2026-03-03 14:35:30.835286',1,1,'CANCELLED',1288,1,NULL,NULL,NULL),(2,'2026-03-03 14:37:49.074699',1,2,'CANCELLED',888,1,NULL,NULL,NULL),(3,'2026-03-03 17:07:17.412281',1,1,'CANCELLED',1288,1,'Hotel A','Executive Business Suite',NULL),(4,'2026-03-03 17:11:28.542518',1,1,'CANCELLED',1288,1,'Hotel A','Executive Business Suite',NULL),(5,'2026-03-03 17:17:33.019391',1,1,'CANCELLED',1288,1,'Hotel A','Executive Business Suite',NULL),(6,'2026-03-03 17:17:38.630319',2,3,'CANCELLED',788,1,'Hotel B','Boutique Aesthetic Queen Room',NULL),(7,'2026-03-03 17:17:49.163488',3,6,'CANCELLED',1588,1,'Hotel C','Family Garden Suite',NULL),(8,'2026-03-03 17:18:09.949181',5,10,'CANCELLED',288,1,'Hotel E','Budget Compact Room',NULL),(9,'2026-03-06 05:55:29.752702',1,1,'PAID',1288,1,'Hotel A','Executive Business Suite',NULL),(10,'2026-03-06 05:56:11.382425',2,3,'PAID',788,1,'Hotel B','Boutique Aesthetic Queen Room',NULL),(11,'2026-03-06 06:04:04.625524',2,4,'PAID',988,1,'Hotel B','Romantic View Room',NULL),(12,'2026-03-06 06:04:35.573125',1,2,'PAID',888,1,'Hotel A','Standard Work-friendly Room',NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `hotel_id` bigint NOT NULL,
  `room_type` varchar(50) NOT NULL,
  `price` double NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `max_people` int DEFAULT '2',
  `total_inventory` int DEFAULT '10',
  `hotel_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_hotel_room` (`hotel_id`),
  CONSTRAINT `fk_hotel_room` FOREIGN KEY (`hotel_id`) REFERENCES `hotel` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,1,'Executive Business Suite',1288,1,4,0,NULL),(2,1,'Standard Work-friendly Room',888,1,2,0,NULL),(3,2,'Boutique Aesthetic Queen Room',788,1,2,0,NULL),(4,2,'Romantic View Room',988,1,2,0,NULL),(5,2,'Designer Theme Studio',1188,1,2,1,NULL),(6,3,'Family Garden Suite',1588,1,5,1,NULL),(7,3,'Child-friendly Twin Room',988,1,5,1,NULL),(8,4,'Long-stay Studio with Kitchenette',688,1,2,1,NULL),(9,4,'Co-working Space Apartment',588,1,3,1,NULL),(10,5,'Budget Compact Room',288,1,2,1,NULL),(11,5,'Backpacker Bunk Room',188,1,2,1,NULL),(12,5,'Student Essential Double',358,1,1,1,NULL);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-06 15:27:50
