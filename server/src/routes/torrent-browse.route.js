const express = require('express');
const TorrentSearchApi = require('torrent-search-api');
const logger = require('../../config/logger');

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

    res.json(torrents);
  } catch (err) {
    logger.error(err);
    res.json([]);
  }
});

module.exports = router;
