CREATE TYPE "public"."project_status" AS ENUM('active', 'planning', 'paused');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"owner" varchar(100) NOT NULL,
	"status" "project_status" NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
