import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertPropertySchema, 
  insertBlogPostSchema 
} from "@shared/schema";
import { ZodError, z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for contact form submissions
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body
      const contactData = insertContactSchema.parse(req.body);
      
      // Store the contact submission
      const submission = await storage.createContactSubmission(contactData);
      
      // Return the submission data
      res.status(201).json({
        success: true,
        message: "Contact submission received successfully",
        data: submission
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details
        });
        return;
      }
      
      // Handle other errors
      console.error("Error handling contact submission:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });

  // Property Routes
  
  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json({
        success: true,
        data: properties
      });
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching properties"
      });
    }
  });

  // Get featured properties
  app.get("/api/properties/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const properties = await storage.getFeaturedProperties(limit);
      res.json({
        success: true,
        data: properties
      });
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching featured properties"
      });
    }
  });

  // Search properties - Note: This must come before the :id route to avoid conflicts
  app.get("/api/properties/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required"
        });
      }

      const properties = await storage.searchProperties(query);
      res.json({
        success: true,
        data: properties
      });
    } catch (error) {
      console.error("Error searching properties:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while searching properties"
      });
    }
  });

  // Get property by ID
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid property ID"
        });
      }

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found"
        });
      }

      res.json({
        success: true,
        data: property
      });
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the property"
      });
    }
  });

  // Create a new property
  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      
      res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: property
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details
        });
        return;
      }
      
      console.error("Error creating property:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the property"
      });
    }
  });

  // Blog Routes
  
  // Get all blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching blog posts"
      });
    }
  });

  // Get recent blog posts
  app.get("/api/blog/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const posts = await storage.getRecentBlogPosts(limit);
      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      console.error("Error fetching recent blog posts:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching recent blog posts"
      });
    }
  });

  // Get blog post by ID
  app.get("/api/blog/:id", async (req, res) => {
    try {
      // Check if the ID is numeric
      if (/^\d+$/.test(req.params.id)) {
        const id = parseInt(req.params.id);
        const post = await storage.getBlogPost(id);
        
        if (!post) {
          return res.status(404).json({
            success: false,
            message: "Blog post not found"
          });
        }
        
        return res.json({
          success: true,
          data: post
        });
      } 
      
      // If not numeric, treat as slug
      const post = await storage.getBlogPostBySlug(req.params.id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Blog post not found"
        });
      }
      
      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the blog post"
      });
    }
  });

  // Create a new blog post
  app.post("/api/blog", async (req, res) => {
    try {
      const blogData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(blogData);
      
      res.status(201).json({
        success: true,
        message: "Blog post created successfully",
        data: post
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details
        });
        return;
      }
      
      console.error("Error creating blog post:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the blog post"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
