CREATE TABLE `section` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_code` text NOT NULL,
	`name` text NOT NULL,
	`teacher_id` integer,
	`created_at` text NOT NULL,
	FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `section_section_code_unique` ON `section` (`section_code`);--> statement-breakpoint
CREATE TABLE `student_section` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` text NOT NULL,
	`section_id` integer,
	`enrolled_at` text NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `section`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teacher` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`user_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teacher_email_unique` ON `teacher` (`email`);--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'STUDENT';--> statement-breakpoint
ALTER TABLE `user` ADD `teacher_id` integer;