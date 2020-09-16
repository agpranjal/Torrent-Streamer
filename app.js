let express = require("express");
let router = require("./routes/main.js");
let path = require("path");
let app = express();


app.use("/public/", express.static(path.join(__dirname, "static")));
app.use("/", router.router);

app.get("/", function(request, response) {
	response.sendFile(path.join(__dirname, "static", "index.html"));
});

app.listen(8000);
