-- AlterTable
ALTER TABLE `user` ADD COLUMN `birthDate` DATETIME(3) NULL,
    ADD COLUMN `lastname` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL;
