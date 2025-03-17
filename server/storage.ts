import { 
  users, 
  type User, 
  type InsertUser, 
  type InsertContact, 
  type ContactSubmission,
  type Property,
  type InsertProperty,
  type BlogPost,
  type InsertBlogPost
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact methods
  createContactSubmission(submission: InsertContact): Promise<ContactSubmission>;
  
  // Property methods
  getAllProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  searchProperties(query: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getRecentBlogPosts(limit?: number): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private properties: Map<number, Property>;
  private blogPosts: Map<number, BlogPost>;
  
  private userCurrentId: number;
  private contactCurrentId: number;
  private propertyCurrentId: number;
  private blogPostCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.properties = new Map();
    this.blogPosts = new Map();
    
    this.userCurrentId = 1;
    this.contactCurrentId = 1;
    this.propertyCurrentId = 1;
    this.blogPostCurrentId = 1;
    
    // Initialize with sample data for development
    this.initSampleData();
  }

  // Sample data initialization
  private initSampleData() {
    // Sample properties
    const sampleProperties: InsertProperty[] = [
      {
        title: "Luxury Villa in Highland Park",
        description: "Beautiful luxury villa with amazing views and premium finishes. This villa features a spacious open floor plan, gourmet kitchen, and a backyard paradise.",
        price: 1250000,
        location: "Highland Park",
        address: "123 Luxury Lane, Highland Park, TX 75205",
        bedrooms: 5,
        bathrooms: 4,
        area: 4200,
        propertyType: "Villa",
        forSale: true,
        featured: true,
        latitude: 32.8310,
        longitude: -96.8005,
        imageUrls: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ]
      },
      {
        title: "Downtown Modern Apartment",
        description: "Sleek, modern apartment in the heart of downtown. Walking distance to restaurants, shops, and entertainment.",
        price: 450000,
        location: "Downtown",
        address: "456 Urban Ave, Dallas, TX 75201",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        propertyType: "Apartment",
        forSale: true,
        featured: true,
        latitude: 32.7767,
        longitude: -96.7970,
        imageUrls: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ]
      },
      {
        title: "Suburban Family Home",
        description: "Perfect family home in a quiet suburban neighborhood with excellent schools and parks nearby.",
        price: 650000,
        location: "Plano",
        address: "789 Family Circle, Plano, TX 75024",
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        propertyType: "House",
        forSale: true,
        featured: false,
        latitude: 33.0198,
        longitude: -96.6989,
        imageUrls: [
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ]
      },
      {
        title: "Lakefront Property",
        description: "Stunning lakefront property with private dock and panoramic water views. Perfect for water enthusiasts.",
        price: 890000,
        location: "Lake Ray Hubbard",
        address: "101 Shoreline Dr, Rockwall, TX 75087",
        bedrooms: 3,
        bathrooms: 2,
        area: 2100,
        propertyType: "House",
        forSale: true,
        featured: true,
        latitude: 32.8650,
        longitude: -96.4369,
        imageUrls: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
        ]
      },
      {
        title: "Luxury Penthouse Apartment",
        description: "Exclusive penthouse with rooftop terrace offering 360-degree city views. Premium finishes throughout.",
        price: 1800000,
        location: "Uptown",
        address: "555 Sky High Blvd, Dallas, TX 75204",
        bedrooms: 3,
        bathrooms: 3,
        area: 2800,
        propertyType: "Penthouse",
        forSale: true,
        featured: true,
        latitude: 32.7954,
        longitude: -96.8021,
        imageUrls: [
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ]
      }
    ];

    // Add sample properties
    sampleProperties.forEach(prop => {
      this.createProperty(prop);
    });

    // Sample blog posts
    const sampleBlogPosts: InsertBlogPost[] = [
      {
        title: "Top 10 Neighborhoods in Dallas for First-Time Homebuyers",
        slug: "top-neighborhoods-first-time-buyers",
        summary: "Discover the best neighborhoods in Dallas for first-time homebuyers based on affordability, amenities, and growth potential.",
        content: `
# Top 10 Neighborhoods in Dallas for First-Time Homebuyers

First-time homebuyers often face challenges when entering the real estate market. Finding the right balance between affordability, amenities, and potential for appreciation can be difficult. In this article, we explore the top 10 neighborhoods in Dallas that are ideal for those purchasing their first home.

## 1. Lake Highlands

With its tree-lined streets and community feel, Lake Highlands offers an excellent entry point for first-time buyers. The area provides good schools, parks, and a convenient location relative to downtown Dallas.

## 2. Richardson

Richardson offers a suburban feel with urban amenities. With the presence of tech companies and UT Dallas, this area provides stable employment opportunities and a diverse community.

## 3. Lewisville

Affordable housing options with new developments make Lewisville attractive for first-time buyers. The lake access provides recreational opportunities.

## 4. Oak Cliff

This up-and-coming neighborhood offers historic charm with ongoing revitalization. First-time buyers can still find value here before prices increase further.

## 5. Garland

With its mix of established neighborhoods and new developments, Garland offers affordable options for first-time buyers along with good schools and parks.

## 6. Carrollton

Great schools and a family-friendly atmosphere make Carrollton popular among first-time homebuyers looking to put down roots.

## 7. Bedford

Located in the mid-cities area, Bedford offers affordable housing with easy access to both Dallas and Fort Worth.

## 8. The Colony

New developments and proximity to major employers make The Colony an excellent choice for those entering the housing market.

## 9. Euless

Part of the HEB school district, Euless offers exceptional value with its central location between major employment centers.

## 10. Addison

For those seeking a more urban lifestyle, Addison provides condo options with walkable access to restaurants and entertainment.

When considering these neighborhoods, first-time buyers should evaluate their commute times, future development plans, and specific needs regarding schools and amenities. Working with a real estate professional who knows these areas well can help identify the perfect match for your lifestyle and budget.
        `,
        author: "Sarah Johnson",
        category: "Buying",
        imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1484&q=80"
      },
      {
        title: "Investment Properties: Analyzing ROI in Today's Market",
        slug: "investment-properties-roi-analysis",
        summary: "Learn how to properly calculate and analyze return on investment for real estate properties in the current market conditions.",
        content: `
# Investment Properties: Analyzing ROI in Today's Market

Real estate has long been considered a solid investment option, but understanding how to properly analyze the return on investment (ROI) is crucial for success. In today's dynamic market, investors need to be particularly diligent about their calculations.

## Understanding ROI in Real Estate

Return on Investment (ROI) measures the profitability of an investment relative to its cost. In real estate, this can be calculated in several ways:

### Cash-on-Cash Return

This measures the annual cash flow relative to the actual cash invested. The formula is:
\`\`\`
Cash-on-Cash Return = Annual Cash Flow ÷ Total Cash Invested
\`\`\`

For example, if you invested $50,000 as a down payment and closing costs, and your property generates $5,000 in annual cash flow after all expenses, your cash-on-cash return would be 10%.

### Capitalization Rate (Cap Rate)

The cap rate is often used for commercial properties and is calculated as:
\`\`\`
Cap Rate = Net Operating Income ÷ Property Value
\`\`\`

### Total Return

This includes both cash flow and appreciation:
\`\`\`
Total Return = (Cash Flow + Appreciation) ÷ Total Investment
\`\`\`

## Current Market Considerations

In today's market, several factors are influencing ROI:

1. **Interest Rates**: Higher rates mean higher mortgage payments, which directly impact cash flow.
2. **Property Appreciation**: While historically strong, the rate of appreciation may be normalizing in some markets.
3. **Rental Demand**: Strong rental demand in many markets is supporting higher rents, positively impacting cash flow.
4. **Operating Expenses**: Rising insurance and property tax costs must be carefully accounted for.

## Analyzing Properties in Today's Market

When evaluating potential investment properties, consider:

- **Location Fundamentals**: Job growth, population trends, and economic diversity remain essential indicators.
- **Conservative Assumptions**: Use realistic estimates for vacancy rates, maintenance costs, and rent increases.
- **Stress Testing**: Calculate ROI under different scenarios, including interest rate increases or extended vacancies.
- **Exit Strategy**: Consider potential resale value and the likely buyer pool when you decide to sell.

By carefully analyzing the ROI potential of investment properties using these guidelines, investors can make more informed decisions in today's complex real estate market.
        `,
        author: "Michael Rodriguez",
        category: "Investment",
        imageUrl: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80"
      },
      {
        title: "Home Staging Tips to Maximize Your Property's Value",
        slug: "home-staging-maximize-value",
        summary: "Expert staging tips that can help sellers present their homes in the best light and achieve maximum value in today's competitive market.",
        content: `
# Home Staging Tips to Maximize Your Property's Value

When selling your home, proper staging can significantly impact both the sale price and the time your property spends on the market. Professional staging helps potential buyers envision themselves living in the space and can highlight your home's best features while minimizing any shortcomings.

## The Impact of Staging

According to the National Association of Realtors, properly staged homes sell for 1-5% more than unstaged homes and spend 73% less time on the market. This makes staging one of the most cost-effective preparations when selling your property.

## Essential Staging Tips

### 1. Declutter and Depersonalize

The first and most crucial step is removing personal items and excess belongings. This includes:
- Family photos
- Personal collections
- Excess furniture
- Items stored in closets (buyers will look!)

Aim to remove 30-50% of your belongings to make spaces appear larger and more neutral.

### 2. Deep Clean Everything

A spotless home signals to buyers that the property has been well-maintained. Pay special attention to:
- Kitchen appliances and countertops
- Bathroom fixtures and tiles
- Flooring and baseboards
- Windows and window treatments

Consider hiring professional cleaners for this critical step.

### 3. Make Strategic Repairs

Address minor issues that might distract buyers:
- Patch holes in walls
- Fix leaky faucets
- Replace broken tiles
- Repair doors that don't close properly
- Touch up paint where needed

### 4. Create Neutral, Appealing Spaces

- Paint walls in neutral, modern colors
- Ensure consistent, adequate lighting throughout
- Arrange furniture to highlight flow and space
- Add strategic touches of color with accessories

### 5. Boost Curb Appeal

First impressions matter enormously:
- Maintain landscaping
- Paint or clean the front door
- Add potted plants near the entrance
- Ensure walkways and driveways are clean and in good condition

### 6. Stage Key Rooms First

If budget is limited, focus on:
1. Living room
2. Master bedroom
3. Kitchen

These areas typically have the biggest impact on buyer decisions.

## Virtual Staging Considerations

In today's digital-first market, consider:
- Professional photography
- Virtual staging for empty properties
- Video tours highlighting flow and features

By implementing these staging strategies, you can significantly increase your property's appeal and potentially command a higher sale price in today's competitive market.
        `,
        author: "Jennifer Martinez",
        category: "Selling",
        imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      }
    ];

    // Add sample blog posts
    sampleBlogPosts.forEach(post => {
      this.createBlogPost(post);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Contact methods
  async createContactSubmission(submission: InsertContact): Promise<ContactSubmission> {
    const id = this.contactCurrentId++;
    const createdAt = new Date().toISOString();
    const contactSubmission: ContactSubmission = { ...submission, id, createdAt };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }

  // Property methods
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getFeaturedProperties(limit: number = 4): Promise<Property[]> {
    const featuredProperties = Array.from(this.properties.values())
      .filter(property => property.featured);
    
    return featuredProperties.slice(0, limit);
  }

  async searchProperties(query: string): Promise<Property[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.properties.values()).filter(property => {
      return (
        property.title.toLowerCase().includes(lowercaseQuery) ||
        property.description.toLowerCase().includes(lowercaseQuery) ||
        property.location.toLowerCase().includes(lowercaseQuery) ||
        property.address.toLowerCase().includes(lowercaseQuery) ||
        property.propertyType.toLowerCase().includes(lowercaseQuery)
      );
    });
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyCurrentId++;
    const createdAt = new Date().toISOString();
    const property: Property = { ...insertProperty, id, createdAt };
    this.properties.set(id, property);
    return property;
  }

  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    for (const post of this.blogPosts.values()) {
      if (post.slug === slug) {
        return post;
      }
    }
    return undefined;
  }

  async getRecentBlogPosts(limit: number = 3): Promise<BlogPost[]> {
    const allPosts = Array.from(this.blogPosts.values());
    // Sort by date, newest first
    const sortedPosts = allPosts.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sortedPosts.slice(0, limit);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCurrentId++;
    const createdAt = new Date().toISOString();
    const blogPost: BlogPost = { ...insertPost, id, createdAt };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
}

export const storage = new MemStorage();
