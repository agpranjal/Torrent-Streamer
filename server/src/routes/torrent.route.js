const express = require('express');
const path = require('path');
const WebTorrent = require('webtorrent');

const p = path.join(__dirname, '..', '..', 'Downloads');

const router = express.Router();
let client;

router.get('/add/:magnet/', function (request, response) {
  client = new WebTorrent();
  const { magnet } = request.params;

  client.on('error', (err) => {
    console.log();
    console.log('Invalid torrent');
    console.log();

    response.status(404).send();
  });

  client.add(magnet, { path: p }, function (torrent) {
    const responseData = [];
    torrent.files.forEach(function (f) {
      responseData.push(f.name);
    });

    // torrent.on("download", function() {
    // console.log(`Downloaded: ${Math.round(torrent.downloaded/1024/1024*100)/100} MB, Progress: ${Math.round(torrent.progress*10000)/100}%`);
    // });

    console.log();
    console.log('++++++++++++++++++++++ TORRENT ADDED +++++++++++++++++++++++++++');
    console.log();

    response.json(responseData);
  });
});

router.get('/stream/:magnet/:file/', function (request, response) {
  const { magnet } = request.params;
  const filename = request.params.file;
  const torrent = client.get(magnet);
  let file;

  for (const f of torrent.files) {
    if (f.name == filename) {
      file = f;
      break;
    }
  }

  stream(file, request, response);
});

router.get('/status/:magnet/', function (request, response) {
  const torrent = client.get(request.params.magnet);

  const info = {
    downloaded: Math.round((torrent.downloaded / 1024 / 1024) * 100) / 100,
    uploaded: Math.round((torrent.uploaded / 1024 / 1024) * 100) / 100,
    progress: Math.round(torrent.progress * 10000) / 100,
    downloadSpeed: Math.round((torrent.downloadSpeed / 1024) * 100) / 100,
    uploadSpeed: Math.round((torrent.uploadSpeed / 1024) * 100) / 100,
    totalSize: Math.round((torrent.length / 1024 / 1024) * 100) / 100,
    name: torrent.name,
    infoHash: torrent.infoHash,
    magnetURI: torrent.magnetURI,
    seedRatio: torrent.ratio,
    numPeers: torrent.numPeers,
    downloadLocation: torrent.path,
    dateOfCreation: torrent.created,
    createdBy: torrent.author,
    comment: torrent.comment,
  };

  response.json({ ...info });
});

router.get('/delete/:magnet/', function (request, response) {
  client.remove(request.params.magnet, function () {
    console.log();
    console.log('---------------------- TORRENT REMOVED ---------------------------');
    console.log();
  });
  response.status(200);
  response.end();
});

function stream(file, request, response) {
  const fileSize = file.length;
  const { range } = request.headers;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;

    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    response.writeHead(206, head);

    // console.log();
    // console.log(`Now streaming: ${file.name}`);
    // console.log();
    console.log('Streaming:', file.name);

    const s = file.createReadStream({ start, end });
    s.pipe(response);
  }
}

module.exports = router;
