let express = require("express");
let path = require("path");
let router = express.Router();
let WebTorrent = require("webtorrent");
let fs = require("fs");

let client;
let p = "/home/ag_pranjal/torrent-streamer/";

router.get("/add/:magnet/", function(request, response) {
	client = new WebTorrent();
	let magnet = request.params.magnet;

	client.add(magnet, {path: p}, function(torrent) {
		let responseData = [];
		torrent.files.forEach(function(f){
			responseData.push(f.name);
		});
	
		torrent.on("download", function() {
			console.log("Progress:", torrent.progress*100);
		});

		response.json(responseData);
	});
});

router.get("/stream/:magnet/:file/", function(request, response) {
	let magnet = request.params.magnet;
	let filename = request.params.file;
	let torrent = client.get(magnet);
	let file;

	for (let f of torrent.files) {
		if (f.name == filename) {
			file = f;
			break;
		}
	}

	console.log(file.name);
	stream(file, request, response);
});


function stream(file, request, response) {
	 const fileSize = file.length;
	 const range = request.headers.range;
	 if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1]  ? parseInt(parts[1], 10) : fileSize-1
		const chunksize = (end-start)+1

		 const head = {
			  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			  'Accept-Ranges': 'bytes',
			  'Content-Length': chunksize,
			  'Content-Type': 'video/mp4',
			}
		response.writeHead(206, head);

		let s = file.createReadStream({start:start, end:end});
		s.pipe(response);
	}
}


module.exports.router = router;
