import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader';

import './BrowseTorrent.css';

const override = `
  display: block;
  margin: auto;
  margin-top: 5em;
  border-color: black;
`;

class BrowseTorrent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: '',
      torrents: [],
      loading: false,
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

    this.setState({
      torrents: [],
    });

    if (this.state.keywords) {
      this.setState({
        loading: true,
      });

      const torrents = await fetch('/browse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords: this.state.keywords }),
      }).then((res) => res.json());

      this.setState({
        torrents,
        loading: false,
      });
    }
  };

  f() {
    return (
      <div className="container">
        <nav className="browse-torrent-keywords center">
          <span className="browse-torrents">
            <i className="material-icons stream-icon">stream</i> Search Torrents
          </span>

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

  render() {
    return (
      <div className="container">
        <div className="magnet-uri-nav-container">
          <span className="stream-torrents">
            <i className="material-icons stream-icon">search</i> Search Torrents
          </span>

          <div className="row magnet-uri-input-container">
            <div className="col l10 m10 s12">
              <input
                className="magnet-uri-input"
                defaultValue={this.state.keywords}
                onChange={this.updateKeywords}
                autoComplete="off"
                placeholder="Type any keyword"
                id="search"
                type="search"
                required
              />
            </div>

            <div onClick={this.browseTorrent} className="col l2 m2 s12 btn stream-btn black waves-effect">
              Search
            </div>
          </div>
        </div>

        <div>
          <MoonLoader css={override} size={150} loading={this.state.loading} speedMultiplier={0.5} />
        </div>

        {this.state.torrents.length ? (
          <table className="browse-torrent-results responsive-table">
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
                      <a href="#">{torrent.title}</a> <span className="new badge">{torrent.provider}</span>
                    </td>
                    <td>
                      {torrent.seeds} <span className="arrow material-icons">arrow_upward</span>
                    </td>
                    <td>
                      {torrent.peers} <span className="arrow material-icons">arrow_downward</span>
                    </td>
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
