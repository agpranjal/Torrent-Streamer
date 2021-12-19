const express = require('express');
const TorrentSearchApi = require('torrent-search-api');

TorrentSearchApi.enablePublicProviders();

const router = express.Router();

router.post('/', async (req, res) => {
  const { keywords } = req.body;
  try {
    let torrents = await TorrentSearchApi.search(keywords);

    torrents = torrents.map((torrent) => {
      if (torrent.magnet) {
        const infoHash = torrent.magnet.match(/\burn:btih:([A-F\d]+)\b/i)[1];
        return { infoHash, ...torrent };
      }
      return {};
    });

    console.log(torrents);

    res.json(torrents);
  } catch (error) {
    console.log(error);
    res.json([]);
  }
});

module.exports = router;
