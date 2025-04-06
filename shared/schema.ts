import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Contact form submission schema
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  phone: true,
  message: true,
});

// Property listing schema
export const propertyListings = pgTable("property_listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  area: integer("area").notNull(), // in square feet
  areaUnit: text("area_unit").notNull().default("sqft"), // sqft, gunta, acre
  propertyType: text("property_type").notNull(), // apartment, house, villa, etc.
  forSale: boolean("for_sale").notNull().default(true), // true for sale, false for rent
  featured: boolean("featured").notNull().default(false),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  imageUrls: text("image_urls").array().notNull(),
  youtubeUrl: text("youtube_url").default("").notNull(), // Optional YouTube video URL
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Create a base schema
const basePropertySchema = createInsertSchema(propertyListings).pick({
  title: true,
  description: true,
  price: true,
  location: true,
  address: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  areaUnit: true,
  propertyType: true,
  forSale: true,
  featured: true,
  latitude: true,
  longitude: true,
  imageUrls: true,
  youtubeUrl: true,
});

// Extend it with Zod to make bedrooms, bathrooms and youtubeUrl optional with default values
export const insertPropertySchema = basePropertySchema.extend({
  bedrooms: z.number().default(0),
  bathrooms: z.number().default(0),
  areaUnit: z.enum(["sqft", "gunta", "acre"]).default("sqft"),
  youtubeUrl: z.string().default(''),
});

// Blog/News post schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  content: true,
  summary: true,
  author: true,
  category: true,
  imageUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertyListings.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
