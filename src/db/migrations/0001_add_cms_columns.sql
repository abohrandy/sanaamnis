ALTER TABLE "blog_posts" ADD COLUMN "category" text DEFAULT 'Guides' NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_name" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_email" text;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "excerpt" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "difficulty" text DEFAULT 'Easy' NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "duration_label" text DEFAULT '30 mins' NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "servings_label" text DEFAULT 'Serves 4' NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "tip" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "uses_product_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "is_published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text;--> statement-breakpoint
-- One-off backfill: historical orders packed "{name}\n{address}\n{state}\n{email}"
-- into shipping_address (see src/app/api/orders/route.ts before customer_email
-- existed). The email is reliably the trailing line and was always zod-validated
-- as a real email address at write time, so extracting it is low-risk; the name
-- has no such guarantee (free text, could itself contain a newline) so it is
-- deliberately left null on historical rows rather than guessed at.
UPDATE "orders"
SET "customer_email" = substring("shipping_address" from '([^\s@]+@[^\s@]+\.[^\s@]+)\s*$')
WHERE "customer_email" IS NULL
  AND "shipping_address" ~ '[^\s@]+@[^\s@]+\.[^\s@]+\s*$';