import express from "express";
import { mongoStart, client } from "./mongo/connect.js"
import { router as authRouter } from "./router/auth.js"
import { router as productRouter } from "./router/product.js"
import session from "express-session"
import cookieParser  from "cookie-parser"
import Fileupload from "express-fileupload"
import cors from "cors"

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:8100",
  methods: "POST,GET,PUT,DELETE",
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:"key",cookie:{maxAge:600000}}));
app.use(Fileupload())

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use("/api/product/", productRouter)
app.use("/api/auth/", authRouter)

mongoStart().catch(console.dir);

var server = app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});

const gracefulShutdown = async () => {
  console.log("Shutting down server...");
  await client.close();
  server.close(() => {
    console.log("Express server stopped.");
    process.exit(0);
  });
};

// Handle shutdown signals
process.on("SIGINT", gracefulShutdown); // Ctrl+C
process.on("SIGTERM", gracefulShutdown); // Termination signal
process.on("exit", gracefulShutdown); // On process
