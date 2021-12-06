import React from 'react';

import './BrowseTorrent.css';

class BrowseTorrent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: '',
      torrents: [],
    };
  }

  startTorrentDownload = async (torrent) => {
    await this.props.disableBrowsing();
    await this.props.setMagnetURI(torrent.infoHash);
    await this.props.downloadTorrent();
  };

  updateKeywords = (e) => {
    this.setState({
      keywords: e.target.value,
    });
  };

  browseTorrent = async () => {
    console.log('Browsing...');

    if (this.state.keywords) {
      const torrents = await fetch('/browse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords: this.state.keywords }),
      }).then((res) => res.json());

      this.setState({
        torrents,
      });
    }
  };

  render() {
    return (
      <div className="container">
        <nav className="browse-torrent-keywords center">
          <div className="nav-wrapper">
            <form>
              <div className="input-field">
                <input
                  className="browse-torrent-input"
                  onChange={this.updateKeywords}
                  defaultValue={this.state.keywords}
                  autoComplete="off"
                  placeholder="Type any keyword"
                  id="browse"
                  type="search"
                  required
                />

                <label className="label-icon" htmlFor="browse"></label>
                <i onClick={this.browseTorrent} className="material-icons">
                  search
                </i>
              </div>
            </form>
          </div>
        </nav>

        {this.state.torrents.length ? (
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Seeds</th>
                <th>Peers</th>
                <th>Size</th>
              </tr>
            </thead>

            <tbody>
              {this.state.torrents.map((torrent, idx) => {
                return (
                  <tr key={idx}>
                    <td onClick={() => this.startTorrentDownload(torrent)}>
                      <a href="#">{torrent.title}</a>
                      <span className="new badge">{torrent.provider}</span>
                    </td>
                    <td>{torrent.seeds}</td>
                    <td>{torrent.peers}</td>
                    <td>{torrent.size}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default BrowseTorrent;
