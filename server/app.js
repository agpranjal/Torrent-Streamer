const express = require("express");
const path = require("path");
const router = require("./routes.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.use("/static", express.static(path.join(__dirname, "..", "client", "build", "static")));
app.use("/", router);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

app.listen(PORT, () => {
    console.log("Server started at", PORT);
    console.log();
});
