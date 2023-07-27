-- --------------------------------------------------------
-- Hôte :                        127.0.0.1
-- Version du serveur:           5.1.72-community - MySQL Community Server (GPL)
-- SE du serveur:                Win32
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour valeo
CREATE DATABASE IF NOT EXISTS `valeo` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `valeo`;

-- Listage de la structure de la table valeo. commande
CREATE TABLE IF NOT EXISTS `commande` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fournisseur_id` int(11) NOT NULL,
  `employe_id` int(11) NOT NULL,
  `date_commande` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fournisseur_id` (`fournisseur_id`),
  KEY `employe_id` (`employe_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table valeo. employe
CREATE TABLE IF NOT EXISTS `employe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `prenom` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `identifiant` int(4) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_identifiant` (`identifiant`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table valeo. fournisseur
CREATE TABLE IF NOT EXISTS `fournisseur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `adresse` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `telephone` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Les données exportées n'étaient pas sélectionnées.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
