ALTER TABLE "payment_links" ALTER COLUMN "escrow_type" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "contract_details" ADD COLUMN "contract_file_name" varchar(255);--> statement-breakpoint
ALTER TABLE "contract_details" ADD COLUMN "contract_file_type" varchar(50);--> statement-breakpoint
ALTER TABLE "payment_links" ADD COLUMN "can_early_release" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "payment_links" ADD COLUMN "early_released_at" timestamp;--> statement-breakpoint
ALTER TABLE "payment_links" ADD COLUMN "early_released_by" varchar(42);--> statement-breakpoint
ALTER TABLE "payment_links" ADD COLUMN "attach_work_contract" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "payment_links" DROP COLUMN "custom_contract";