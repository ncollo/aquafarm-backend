import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import inventoryRoutes from "./routes/inventory";
import orderRoutes from "./routes/orders";
import paymentRoutes from "./routes/payments";
import productRoutes from "./routes/products";
import importRoutes from "./routes/imports";
import stockRoutes from "./routes/stock";
import salesRoutes from "./routes/sales";
import supplierRoutes from "./routes/suppliers";
import analyticsRoutes from "./routes/analytics";
import reportRoutes from "./routes/reports";
import alertRoutes from "./routes/alerts";
import auditRoutes from "./routes/audit";

import { seedDefaultUsers } from "./config/seedUsers";
import { seedDefaultProducts } from "./config/seedProducts";
import AlertScannerService from "./services/alertScanner";

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Global Rate Limiter: max 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

app.use(express.json({ limit: "10kb" })); // Body limit prevents payload attacks
app.use(express.urlencoded({ extended: true }));

// Core API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/imports", importRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/audit-logs", auditRoutes);

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Centralized Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

// Initialize background tasks and user seeds
seedDefaultUsers().catch(console.error);
seedDefaultProducts().catch(console.error);
AlertScannerService.startScheduler();

export default app;