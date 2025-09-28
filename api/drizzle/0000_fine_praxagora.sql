CREATE TABLE "contract_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_link_id" uuid NOT NULL,
	"contract_terms" text,
	"contract_file_url" varchar(500),
	"arbitrator_address" varchar(42),
	"arbitration_fee" numeric(18, 8),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"short_id" varchar(12) NOT NULL,
	"creator_address" varchar(42) NOT NULL,
	"link_type" varchar(10) NOT NULL,
	"target_address" varchar(42),
	"amount" numeric(18, 8) NOT NULL,
	"token" varchar(10) NOT NULL,
	"chain" varchar(20) NOT NULL,
	"escrow_type" varchar(10) NOT NULL,
	"escrow_hours" integer,
	"description" text,
	"status" varchar(20) DEFAULT 'created' NOT NULL,
	"accepted_by" varchar(42),
	"accepted_at" timestamp,
	"yellow_channel_id" varchar(255),
	"nitrolite_transaction_hash" varchar(66),
	"yellow_network_status" varchar(20),
	"custom_contract" boolean DEFAULT false,
	"dispute_resolution" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "payment_links_short_id_unique" UNIQUE("short_id")
);
--> statement-breakpoint
CREATE TABLE "yellow_channels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_link_id" uuid NOT NULL,
	"channel_id" varchar(255) NOT NULL,
	"participant_a" varchar(42) NOT NULL,
	"participant_b" varchar(42) NOT NULL,
	"asset" varchar(10) NOT NULL,
	"total_amount" numeric(18, 8) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"settled_at" timestamp,
	CONSTRAINT "yellow_channels_channel_id_unique" UNIQUE("channel_id")
);
--> statement-breakpoint
ALTER TABLE "contract_details" ADD CONSTRAINT "contract_details_payment_link_id_payment_links_id_fk" FOREIGN KEY ("payment_link_id") REFERENCES "public"."payment_links"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yellow_channels" ADD CONSTRAINT "yellow_channels_payment_link_id_payment_links_id_fk" FOREIGN KEY ("payment_link_id") REFERENCES "public"."payment_links"("id") ON DELETE no action ON UPDATE no action;