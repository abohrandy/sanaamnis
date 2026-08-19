import { pgTable, text, timestamp, boolean, integer, numeric, jsonb, uuid, index, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Better Auth Standard Schemas ---

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: text("role"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
}, (t) => [
  index("user_email_idx").on(t.email)
]);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});


// --- RBAC: Roles & Permissions System ---

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // admin, editor, customer
  description: text("description"),
});

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  action: text("action").notNull().unique(), // e.g. "create:product", "delete:page"
  description: text("description"),
});

export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  roleId: uuid("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
}, (t) => [
  unique("user_role_uniq").on(t.userId, t.roleId)
]);

export const rolePermissions = pgTable("role_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleId: uuid("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  permissionId: uuid("permission_id")
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),
}, (t) => [
  unique("role_permission_uniq").on(t.roleId, t.permissionId)
]);


// --- Product Catalog & Collections ---

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("cat_slug_idx").on(t.slug)
]);

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("prod_slug_idx").on(t.slug),
  index("prod_cat_idx").on(t.categoryId)
]);

export const collectionProducts = pgTable("collection_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  collectionId: uuid("collection_id")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
}, (t) => [
  unique("coll_prod_uniq").on(t.collectionId, t.productId)
]);

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(), // e.g. "XL / Black"
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull(),
  imageUrl: text("image_url"),
  // A variant with order history can't be hard-deleted (orderItems.variantId is
  // onDelete: restrict) — this lets admin discontinue a SKU without breaking
  // past orders or hiding the whole parent product.
  isActive: boolean("is_active").default(true).notNull(),
}, (t) => [
  index("var_sku_idx").on(t.sku),
  index("var_prod_idx").on(t.productId)
]);


// --- Orders & Voucher Systems ---

export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  discountType: text("discount_type").default("percentage").notNull(), // percentage or fixed
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  orderNumber: text("order_number").notNull().unique(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  couponId: uuid("coupon_id").references(() => coupons.id, { onDelete: "set null" }),
  // pending, paid, payment_failed, shipped, delivered, cancelled
  status: text("status").default("pending").notNull(),
  paymentReference: text("payment_reference"),
  shippingAddress: text("shipping_address").notNull(),
  // Previously the only place the customer's name/email were recorded was baked
  // into shippingAddress as "{name}\n{address}\n{state}\n{email}" — unusable for
  // an admin customer view. New orders populate these directly; historical rows
  // are backfilled for email only (see migration 0002), name is left null since
  // it isn't reliably extractable from free text.
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("order_num_idx").on(t.orderNumber),
  index("order_user_idx").on(t.userId)
]);

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: numeric("price_at_purchase", { precision: 10, scale: 2 }).notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  reference: text("reference").notNull().unique(),
  gateway: text("gateway").default("paystack").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // success, failed, reversed
  rawResponse: jsonb("raw_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wishlist = pgTable("wishlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
}, (t) => [
  unique("wish_user_prod_uniq").on(t.userId, t.productId)
]);

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1 to 5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


// --- Headless CMS Entities ---

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  provider: text("provider").default("cloudinary").notNull(),
  /** "image" or "video" — decides which Cloudinary resource_type endpoint an upload/delete uses. */
  kind: text("kind").default("image").notNull(),
  bytes: integer("bytes"),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pageBlocks = pgTable("page_blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id")
    .notNull()
    .references(() => pages.id, { onDelete: "cascade" }),
  blockType: text("block_type").notNull(), // hero, rich_text, featured_products
  properties: jsonb("properties").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const menus = pgTable("menus", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // e.g. "header-nav", "footer-links"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  menuId: uuid("menu_id")
    .notNull()
    .references(() => menus.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  url: text("url").notNull(),
  parentItemId: uuid("parent_item_id"), // recursive submenus support
  sortOrder: integer("sort_order").notNull(),
});

export const authors = pgTable("authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  // Body copy: paragraphs separated by a blank line; a line starting with "## "
  // is rendered as a subheading. See src/lib/blog.ts's parseArticleBody().
  content: text("content"),
  category: text("category").default("Guides").notNull(),
  imageUrl: text("image_url"),
  authorId: uuid("author_id").references(() => authors.id, { onDelete: "set null" }),
  isPublished: boolean("is_published").default(true).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  difficulty: text("difficulty").default("Easy").notNull(), // Easy, Simple, Takes practice
  // Display strings ("35 mins", "Serves 4") rather than structured numbers — the
  // source content is authored this way and nothing in the app computes on
  // minutes/servings as numbers. prepTimeMinutes/cookTimeMinutes below are kept
  // for potential future use but are not read anywhere today.
  durationLabel: text("duration_label").default("30 mins").notNull(),
  servingsLabel: text("servings_label").default("Serves 4").notNull(),
  ingredients: jsonb("ingredients").notNull(), // list of ingredient strings
  instructions: text("instructions"), // one step per line
  tip: text("tip"),
  usesProductSlugs: jsonb("uses_product_slugs").default([]).notNull(), // string[] of catalog product slugs
  prepTimeMinutes: integer("prep_time_minutes"),
  cookTimeMinutes: integer("cook_time_minutes"),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientName: text("client_name").notNull(),
  role: text("role"), // e.g. "Verified Collector"
  quote: text("quote").notNull(),
  rating: integer("rating").default(5).notNull(),
  imageUrl: text("image_url"),
});

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").default("general").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const distributors = pgTable("distributors", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  region: text("region").notNull(), // e.g. "Lagos Mainland"
  areasCovered: text("areas_covered"), // e.g. "Apo, Garki, Guzape, Gudu, Durumi"
  contactName: text("contact_name"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  address: text("address"),
  notes: text("notes"), // e.g. "Search Community Mart on Maps"
  sortOrder: integer("sort_order").default(0).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


// --- Configuration & Logging ---

export const seoMetadata = pgTable("seo_metadata", {
  id: uuid("id").primaryKey().defaultRandom(),
  routePath: text("route_path").notNull().unique(), // e.g. "/catalog", "/about"
  title: text("title").notNull(),
  description: text("description"),
  ogImage: text("og_image"),
  keywords: text("keywords"),
});

export const redirectRules = pgTable("redirect_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromPath: text("from_path").notNull().unique(),
  toPath: text("to_path").notNull(),
  statusCode: integer("status_code").default(301).notNull(), // 301 or 302
});

export const settings = pgTable("settings", {
  id: text("key").primaryKey(), // site-name, site-logo, contact-email, primary-color
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  action: text("action").notNull(), // e.g. "update:product", "delete:page"
  entityName: text("entity_name").notNull(), // e.g. "products", "pages"
  entityId: text("entity_id"),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


// --- Relationship Maps ---

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  orders: many(orders),
  reviews: many(reviews),
  wishlist: many(wishlist),
  auditLogs: many(auditLogs),
  notifications: many(notifications),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(user, { fields: [userRoles.userId], references: [user.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, { fields: [rolePermissions.permissionId], references: [permissions.id] }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  variants: many(productVariants),
  reviews: many(reviews),
  collectionProducts: many(collectionProducts),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
  orderItems: many(orderItems),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// user.reviews and products.reviews declared the "many" side but the inverse was
// missing, so `with: { user: true }` on a reviews query could not resolve.
export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(user, { fields: [reviews.userId], references: [user.id] }),
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  collectionProducts: many(collectionProducts),
}));

export const collectionProductsRelations = relations(collectionProducts, ({ one }) => ({
  collection: one(collections, { fields: [collectionProducts.collectionId], references: [collections.id] }),
  product: one(products, { fields: [collectionProducts.productId], references: [products.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, { fields: [orders.userId], references: [user.id] }),
  items: many(orderItems),
  coupon: one(coupons, { fields: [orders.couponId], references: [coupons.id] }),
  transactions: many(transactions),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  variant: one(productVariants, { fields: [orderItems.variantId], references: [productVariants.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  order: one(orders, { fields: [transactions.orderId], references: [orders.id] }),
}));

export const pagesRelations = relations(pages, ({ many }) => ({
  blocks: many(pageBlocks),
}));

export const pageBlocksRelations = relations(pageBlocks, ({ one }) => ({
  page: one(pages, { fields: [pageBlocks.pageId], references: [pages.id] }),
}));

export const menusRelations = relations(menus, ({ many }) => ({
  items: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  menu: one(menus, { fields: [menuItems.menuId], references: [menus.id] }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(authors, { fields: [blogPosts.authorId], references: [authors.id] }),
}));
