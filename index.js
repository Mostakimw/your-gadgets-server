require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("your-gadgets");
    const productsCollection = db.collection("products");
    const flashSaleCollection = db.collection("flash-sale");

    //! All products, Filtering, Sorting based on rating
    app.get("/api/v1/products", async (req, res) => {
      try {
        // Get query parameters for filtering
        const { brand, category, minPrice, maxPrice, sortBy, limit } =
          req.query;

        // Construct filter object based on provided query parameters
        const filter = {};

        // Filter products by brand
        if (brand) {
          filter.brand = brand;
        }
        // Filter products by category
        if (category) {
          filter.category = category;
        }
        // Filter products by price range
        if (minPrice || maxPrice) {
          filter.price = {};
          if (minPrice) {
            filter.price.$gte = parseFloat(minPrice);
          }
          if (maxPrice) {
            filter.price.$lte = parseFloat(maxPrice);
          }
        }

        // Query the database with filtering and sorting
        const query = productsCollection.find(filter);
        if (sortBy === "rating") {
          query.sort({ rating: -1 }); // Sort by rating in descending order
        }
        if (limit) {
          query.limit(parseInt(limit)); // Limit the number of products returned
        }

        const products = await query.toArray();
        res.json(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    //! Get all products sorted by ratingsNumber top products
    app.get("/api/v1/top-products", async (req, res) => {
      try {
        const products = await productsCollection
          .find()
          .sort({ numReviews: -1 })
          .toArray();
        res.json(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    //! Get flashSaleCollection products
    app.get("/api/v1/flash-sale", async (req, res) => {
      try {
        const products = await flashSaleCollection.find().toArray();
        res.json(products);
      } catch (error) {
        console.error("Error fetching flash sale products:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    //! Get single products
    app.get("/api/v1/products/:id", async (req, res) => {
      try {
        const productId = req.params.id;
        const product = await productsCollection.findOne({
          _id: new ObjectId(productId),
        });
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
