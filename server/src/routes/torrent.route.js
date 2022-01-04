const express = require('express');
const path = require('path');
const webtorrent = require('webtorrent');
const logger = require('../../config/logger');

const downloadPath = path.join(__dirname, '..', '..', 'Downloads');

const router = express.Router();
const client = new webtorrent();

router.get('/add/:magnet/', (req, res) => {
  const { magnet } = req.params;

  const torrentObj = client.add(magnet, { path: downloadPath, destroyStoreOnDestroy: true }, (torrent) => {
    logger.info(`[+] TORRENT ADDED: ${magnet}`);

    const torrentFiles = torrent.files.map((file) => file.name);

    // torrent.on("download", function() {
    // console.log(`Downloaded: ${Math.round(torrent.downloaded/1024/1024*100)/100} MB, Progress: ${Math.round(torrent.progress*10000)/100}%`);
    // });

    res.json(torrentFiles);
  });

  torrentObj.on('error', (err) => {
    logger.error(err);
    res.status(500).end();
  });
});

router.get('/stream/:magnet/:file/', (req, res) => {
  const { file: filename, magnet } = req.params;

  const torrent = client.get(magnet);
  const file = torrent.files.find((f) => f.name == filename);

  stream(file, req, res);
});

router.get('/status/:magnet/', (req, res) => {
  const { magnet } = req.params;
  const torrent = client.get(magnet);

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

  res.json({ ...info });
});

router.delete('/delete/:magnet/', function (req, res) {
  const { magnet } = req.params;

  client.remove(magnet, () => logger.info(`[-] TORRENT REMOVED: ${magnet}`));

  res.status(202).end();
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

    logger.info(`[->] Streaming: ${file.name}`);

    const s = file.createReadStream({ start, end });
    s.pipe(response);
  }
}

module.exports = router;
