let express = require("express");
let path = require("path");
let WebTorrent = require("webtorrent");
let router = express.Router();

let client;
let p = path.join(__dirname, "..", "downloaded");

router.get("/add/:magnet/", function(request, response) {
	client = new WebTorrent();
	let magnet = request.params.magnet;

	client.add(magnet, {path: p}, function(torrent) {
		let responseData = [];
		torrent.files.forEach(function(f){
			responseData.push(f.name);
		});
	
		torrent.on("download", function() {
			console.log(`Downloaded: ${Math.round(torrent.downloaded/1024/1024*100)/100} MB, Progress: ${Math.round(torrent.progress*10000)/100}%`);
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

router.get("/status/:magnet/", function(request, response) {
    let torrent = client.get(request.params.magnet);
    let downloaded = Math.round(torrent.downloaded/1024/1024*100)/100;
    let progress = Math.round(torrent.progress*10000)/100;

    response.json({downloaded:downloaded, progress:progress});
});

router.get("/delete/:magnet/", function(request, response) {
    client.remove(request.params.magnet, function() {
        console.log();
        console.log("********************** TORRENT REMOVED***************************");
        console.log();
    });
    response.status(200);
    response.end();
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

		console.log();
		console.log(`Now streaming: ${file.name}`);
		console.log();

		let s = file.createReadStream({start:start, end:end});
		s.pipe(response);
	}
}


module.exports.router = router;
