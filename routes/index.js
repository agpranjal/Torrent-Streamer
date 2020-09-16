let express = require("express");
let path = require("path");
let router = express.Router();

router.get("/", function(request, response) {
	response.sendFile(path.join(__dirname, "static", "index.html"));
});

module.exports.router = router;
