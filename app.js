let express = require("express");
let router = require("./routes/index.js");
let app = express();

app.use("/", router.router);
app.listen(8000);

