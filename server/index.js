import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { connectDatabase } from "./db.js";
import contentRoutes from "./routes/content.js";
import formRoutes from "./routes/forms.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configure multer for file uploads
const upload = multer({
  dest: "public/uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("public/uploads"));

app.use("/api/content", contentRoutes);
app.use("/api/forms", formRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NGO backend is running" });
});

connectDatabase(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
