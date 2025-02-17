import express, { Router, Request, Response, NextFunction } from "express";
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { readdir } from "fs/promises";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const controllersDir = path.join(__dirname, 'routes');

async function registerRoutes() {
  const files = await readdir(controllersDir);
  
  for (const file of files) {
      const routeName = path.parse(file).name;
      const routePath = path.join(controllersDir, file);
      
      const routeModule = await import(routePath);
      const router: Router = routeModule.default || routeModule;
      
      app.use(`/api/${routeName}`, router);
  }
}

registerRoutes();

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
