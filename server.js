import express from "express";
import { mongoStart, client } from "./mongo/connect.js"

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

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
