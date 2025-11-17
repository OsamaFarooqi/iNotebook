const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

connectToMongo();
const app = express();
const port = 5000;

// Use the cors middleware
app.use(
  cors({
    origin: `http://localhost:3000`, // Specify the exact origin of your frontend. 3000 is port for frontend React App.
  })
);
// To use req.body we need to use this
app.use(express.json());

// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotebook app is listening on port ${port}`);
});
