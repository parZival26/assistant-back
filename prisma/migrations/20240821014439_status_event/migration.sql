-- AlterTable
ALTER TABLE `Event` ADD COLUMN `status` ENUM('starting_soon', 'ongoing', 'finished') NOT NULL DEFAULT 'starting_soon';
