import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";
import cors from "cors";

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);
app.get("/", (req, res) => res.json({ msg: "hello world from the server" }));

mongoose.connect(
  "mongodb+srv://zahid:zahid495@cluster0.t7uye72.mongodb.net/todo-app"
);

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
