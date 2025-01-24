import express from "express";

const app = express();
const port = 8080;

// Start server
app.listen(port, () => {
  console.log(`Express Test app listening on port ${port}`);
});

// Middleware

app.use(express.json());

// Static

app.use("/", express.static("public"));
