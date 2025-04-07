import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertPropertySchema, 
  insertBlogPostSchema
} from "@shared/schema";
import { ZodError, z } from "zod";
import { fromZodError } from "zod-validation-error";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import MemoryStore from "memorystore";

// Create an authenticated middleware to protect admin routes
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Log authentication status for debugging
  console.log('Auth check - Session ID:', req.sessionID);
  console.log('Auth check - Is authenticated:', req.isAuthenticated());
  if (req.user) {
    console.log('Auth check - User:', req.user);
  } else {
    console.log('Auth check - No user in request');
  }
  
  if (req.isAuthenticated()) {
    console.log('Auth check - Access granted');
    return next();
  }
  
  console.log('Auth check - Access denied');
  return res.status(401).json({
    success: false,
    message: "Unauthorized access. Please login first."
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session store
  const MemorySessionStore = MemoryStore(session);
  
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'nainaland-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to false for development
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    },
    store: new MemorySessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));
  
  // Trust first proxy
  app.set('trust proxy', 1);
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure passport to use local strategy
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        
        // In a real application, you would use bcrypt to compare hashed passwords
        // This is simplified for the demo
        if (password !== user.password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  // Serialize user to the session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from the session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  // Authentication routes
  app.post('/api/auth/login', (req, res, next) => {
    console.log('Login attempt:', req.body.username);
    
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({
          success: false,
          message: 'Internal server error during authentication'
        });
      }
      
      if (!user) {
        console.log('Login failed:', info?.message);
        return res.status(401).json({
          success: false,
          message: info?.message || 'Invalid username or password'
        });
      }
      
      // Manual login using req.login
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error('Session save error:', loginErr);
          return res.status(500).json({
            success: false,
            message: 'Error saving session'
          });
        }
        
        console.log('Login successful, session saved for user:', user.id);
        
        // Return success with user info
        return res.json({
          success: true,
          message: 'Authentication successful',
          user: {
            id: user.id,
            username: user.username
          }
        });
      });
    })(req, res, next);
  });
  
  app.get('/api/auth/status', (req, res) => {
    console.log('Auth status check. Session ID:', req.sessionID);
    console.log('Is authenticated:', req.isAuthenticated());
    
    if (req.isAuthenticated()) {
      console.log('User from session:', req.user);
      res.json({
        success: true,
        authenticated: true,
        user: {
          id: (req.user as any).id,
          username: (req.user as any).username,
          // Don't include password in response
        }
      });
    } else {
      console.log('No authenticated user found in session');
      res.json({
        success: true,
        authenticated: false
      });
    }
  });
  
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error logging out',
          error: err.message
        });
      }
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  });
  
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

  // Create a new property (protected route)
  app.post("/api/properties", isAuthenticated, async (req, res) => {
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

  // Create a new blog post (protected route)
  app.post("/api/blog", isAuthenticated, async (req, res) => {
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
