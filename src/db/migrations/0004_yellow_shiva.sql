CREATE TABLE "bundle_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bundle_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bundles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"tagline" text,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"regular_value" numeric(10, 2),
	"badge" text,
	"hero_image_url" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bundles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "bundle_id" uuid;--> statement-breakpoint
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_bundle_id_bundles_id_fk" FOREIGN KEY ("bundle_id") REFERENCES "public"."bundles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bundle_item_bundle_idx" ON "bundle_items" USING btree ("bundle_id");--> statement-breakpoint
CREATE INDEX "bundle_sort_idx" ON "bundles" USING btree ("sort_order");--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_bundle_id_bundles_id_fk" FOREIGN KEY ("bundle_id") REFERENCES "public"."bundles"("id") ON DELETE set null ON UPDATE no action;