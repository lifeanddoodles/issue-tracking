import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
