-- MySQL Script generated by MySQL Workbench
-- Sat Nov 24 14:44:17 2018
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema chatweb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema chatweb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `chatweb` DEFAULT CHARACTER SET utf8 ;
USE `chatweb` ;

-- -----------------------------------------------------
-- Table `chatweb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `chatweb`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `profile_pic` LONGTEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `chatweb`.`rooms`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `chatweb`.`rooms` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `chatweb`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `chatweb`.`messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `message` LONGTEXT NOT NULL,
  `room_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_messages_rooms_idx` (`room_id` ASC),
  INDEX `fk_messages_users1_idx` (`sender_id` ASC),
  CONSTRAINT `fk_messages_rooms`
    FOREIGN KEY (`room_id`)
    REFERENCES `chatweb`.`rooms` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_messages_users1`
    FOREIGN KEY (`sender_id`)
    REFERENCES `chatweb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `chatweb`.`user_room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `chatweb`.`user_room` (
  `users_id` INT NOT NULL,
  `rooms_id` INT NOT NULL,
  INDEX `fk_user_room_users1_idx` (`users_id` ASC),
  INDEX `fk_user_room_rooms1_idx` (`rooms_id` ASC),
  PRIMARY KEY (`users_id`, `rooms_id`),
  CONSTRAINT `fk_user_room_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `chatweb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_room_rooms1`
    FOREIGN KEY (`rooms_id`)
    REFERENCES `chatweb`.`rooms` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
