const express = require("express");
const UserRoutes = require("./src/users/UserRoutes");
const app = express();

const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world dsdas");
});

app.use("/api/v1/users", UserRoutes);

app.listen(port, () => console.log(`App Listening on port ${port}`));
