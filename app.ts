import express, {
  Router,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
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

const controllersDir = path.join(__dirname, "routes");

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

registerRoutes()
  .then(() => {
    const globalErrorHandler: ErrorRequestHandler = (
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ): void => {
      console.error("Global Error:", err.stack);

      // Default server error
      res.status(500).json({
        error: err.message,
      });
      return;
    };

    app.use(globalErrorHandler);

    app.get('/media/:filename', (req, res) => {
      const { filename } = req.params;
      const filePath = path.join(__dirname, filename);
      res.sendFile(filePath, (err) => {
        if (err) res.status(404).send('File not found');
      });
    });

    console.log("✅ Routes registered, error handler added.");
  })
  .catch((err) => {
    console.error("Error registering routes:", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
