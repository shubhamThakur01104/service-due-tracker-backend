import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// connect database
connectDB();

// routes
import customerRoutes from "./routes/customer.route.js";
import unitRoutes from "./routes/unit.route.js";
import importRoutes from "./routes/import.routes.js";

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/units", unitRoutes);
app.use("/api/v1/import", importRoutes);

// global error handler
app.use((err, _id, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
