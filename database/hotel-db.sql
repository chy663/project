CREATE DATABASE  IF NOT EXISTS `hotel_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hotel_db`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
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
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) DEFAULT NULL,
  `room_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (1,'2026-03-22 23:14:48.101813',1,1);
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel`
--

DROP TABLE IF EXISTS `hotel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` text,
  `price` varchar(255) DEFAULT NULL,
  `star_rating` int DEFAULT NULL,
  `admin_id` bigint DEFAULT NULL,
  `capacity` varchar(255) DEFAULT NULL,
  `max_capacity` int DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel`
--

LOCK TABLES `hotel` WRITE;
/*!40000 ALTER TABLE `hotel` DISABLE KEYS */;
INSERT INTO `hotel` VALUES (1,'InterContinental Grand','Beijing CBD','Located in the heart of Beijing CBD, this is a luxurious five-star business hotel. The hotel offers high-speed internet and ergonomic workstations with ergonomic chairs, as well as numerous multi-functional meeting rooms. The rooftop bar offers panoramic views of the CCTV Headquarters (\"Big Pants\"), making it the preferred choice for business travelers.','400 - 450',5,2,'2 Persons',2,'luxury,citycenter,high-speedinternet,ergonomicworkstations,meetingrooms,rooftopbar'),(2,'Sunny Garden Resort','Sanlitun','Located in the trendy Sanlitun landmark, this boutique hotel boasts a modern interior design by a renowned architect. Within walking distance of local shopping areas, guest rooms feature smart-room amenities. The hotel Wellness Spa offers top-notch spa services, making it an ideal destination for travelers seeking a romantic and stylish lifestyle.','350-420',4,3,'4-6 Persons',6,'boutique,interiordesign,localattractions,smart-room,wellness,spa,romantic'),(3,'The Neon Velvet','Gubei Water Town','Located in Gubei Water Town at the foot of the Simatai Great Wall, this is a family-oriented hotel. It offers spacious family-friendly rooms, a dedicated kids club, and a year-round heated family pool. Here, you can enjoy unique historic architectural charm, making it a paradise for family trips and a child-friendly environment.','390-550',5,4,'2 Persons',2,'family-oriented,child-friendly,kidsclub,familypool,historic'),(4,'Heritage Extended Stay','Wangjing Science and Technology Park','Located in the heart of Wangjing Science and Technology Park, this extended-stay apartment hotel is designed for travelers on medium to long-term business trips. Each room features private kitchens and independent laundry facilities. The hotel is pet-friendly and offers ample free parking and EV-charging charging stations, creating a clean and comfortable atmosphere like home.','150-220',3,5,'2-3 Persons',3,'extended-stay,privatekitchens,laundryfacilities,pet-friendly,free-parking,ev-charging,clean'),(5,'Smart Stay Hostel','Houhai Old Town','A traditional-style hotel nestled in the old hutongs of Houhai, Beijing. This budget-friendly hotel offers excellent value and is perfect for backpackers exploring Beijing hutong culture. Close to local attractions like Houhai Bar Street, and with communal areas offering a wealth of social activities, it is the most affordable option for experiencing authentic Beijing historic culture.','55-65',2,6,'1-2 Persons',2,'hostel,backpacker,budget,affordable,localattractions,communalareas,historic');
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
  `user_id` bigint DEFAULT NULL,
  `hotel_id` bigint DEFAULT NULL,
  `room_id` bigint DEFAULT NULL,
  `total_price` double NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `complete_time` datetime(6) DEFAULT NULL,
  `create_time` datetime(6) DEFAULT NULL,
  `guest_name` varchar(255) DEFAULT NULL,
  `guest_phone` varchar(255) DEFAULT NULL,
  `hotel_name` varchar(255) DEFAULT NULL,
  `room_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_hotel` (`hotel_id`),
  KEY `fk_order_room` (`room_id`),
  KEY `fk_order_users` (`user_id`),
  CONSTRAINT `fk_order_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotel` (`id`),
  CONSTRAINT `fk_order_room` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  CONSTRAINT `fk_order_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (14,1,1,1,450,'COMPLETED','2026-03-23 00:39:11.442547','2026-03-23 00:38:54.521496','1','1','InterContinental Grand','Executive King Suite');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text,
  `create_time` datetime(6) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `room_id` bigint DEFAULT NULL,
  `room_type` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'good','2026-03-23 00:39:17.374450',NULL,1,NULL,1);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `hotel_id` bigint DEFAULT NULL,
  `room_type` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `hotel_name` varchar(255) DEFAULT NULL,
  `is_available` bit(1) NOT NULL,
  `max_people` int DEFAULT NULL,
  `total_inventory` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_room_hotel` (`hotel_id`),
  CONSTRAINT `fk_room_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotel` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,1,'Executive King Suite',450,'InterContinental Grand',_binary '',2,0),(2,1,'Business Twin Room',400,'InterContinental Grand',_binary '',2,1),(3,2,'Family Ocean Theme Suite',350,'Sunny Garden Resort',_binary '',4,1),(4,2,'Deluxe Connecting Rooms',420,'Sunny Garden Resort',_binary '',6,1),(5,3,'Neon Mood Boutique Room',390,'The Neon Velvet',_binary '',2,1),(6,3,'Velvet Skyline Suite',550,'The Neon Velvet',_binary '',2,1),(7,4,'Studio Kitchenette Apartment',150,'Heritage Extended Stay',_binary '',2,1),(8,4,'One-Bedroom Residential Suite',220,'Heritage Extended Stay',_binary '',3,1),(9,5,'Standard 4-Bed Dormitory',35,'Smart Stay Hostel',_binary '',1,1),(10,5,'Private Economy Double',65,'Smart Stay Hostel',_binary '',2,1);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-03-22 12:31:51.794837','chy663','$2a$10$umVpONKyc/X0PKjAg5i.MOXExNWVDP81dj87b6NouMdgjv8DMHdC6','USER','chy'),(2,'2026-03-22 13:48:06.738634','admin1','$2a$10$4Rlcu1t6CChcjazWZ4PL3O8YFCGg5FCBz8vi8ONgQRyWS/vIwFDGK','ADMIN','admin1'),(3,'2026-03-22 21:56:24.061759','admin2','$2a$10$JQT43YjP6XI92nLQbwYSIeYhi4haKRWQ/PIsMgY6FYF0qc9PouGiS','ADMIN','admin2'),(4,'2026-03-22 21:57:58.734507','admin3','$2a$10$zjSKS68yROr6U2nC5QQLxO1XifCvH4wB46S9dfLN9oU/E5y5uIykK','ADMIN','admin3'),(5,'2026-03-22 21:58:10.146699','admin4','$2a$10$EpEnirtGnn.uQ5K6zVbd5ujaxC8tW7t6tu2tUNGyPPAFEAmMyDi42','ADMIN','admin4'),(6,'2026-03-22 21:58:21.288269','admin5','$2a$10$o0S/z.uhmLPEH6YE/BZFQeEVUPPZDklffohj2N0deq9iVP7VDFRcO','ADMIN','admin5');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-24 15:42:05
