import React from 'react';
import './SearchTorrent.css';

class SearchTorrent extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="magnet-uri-nav-container">
          <span className="stream-torrents">
            <i className="material-icons stream-icon">stream</i> Stream Torrents
          </span>

          <div className="row magnet-uri-input-container">
            <div className="col l10 m10 s12">
              <input
                className="magnet-uri-input"
                defaultValue={this.props.magnetURI}
                onChange={this.props.handleMagnetURIInput}
                autoComplete="off"
                placeholder="Magnet URI / Info Hash"
                id="search"
                type="search"
                required
              />
            </div>

            <div onClick={this.props.downloadTorrent} className="col l2 m2 s12 btn stream-btn black waves-effect">
              Stream
            </div>
          </div>
        </div>

        <SampleTorrents />
      </div>
    );
  }
}

class SampleTorrents extends React.Component {
  render() {
    return (
      <div className="row center sample-torrent-container">
        <div className="col s12">
          <table className="centered responsive-table">
            <thead>
              <tr>
                <th className="flow-text">Media</th>
                <th className="flow-text">Info Hash</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Transformers Dark Of The Moon</td>
                <td>13EF31D1E2CB4050ADD4933CAB8C0D13F22C6252</td>
              </tr>
              <tr>
                <td>Transformers Age Of Extinction</td>
                <td>774DA94A7602E1B053C61205DF20C810A5621828</td>
              </tr>
              <tr>
                <td>Batman Begins</td>
                <td>52FD58172C296021F2E351B8A12BBC8BE7C88F8D</td>
              </tr>
              <tr>
                <td>Batman The Dark Night Returns</td>
                <td>D0C50196258B143C8E65F04BB0AD51B31CCE07E5</td>
              </tr>
              <tr>
                <td>Batman And Robin</td>
                <td>4628C4921E796C1A2EC509FAD1EFC1FC244E8775</td>
              </tr>
              <tr>
                <td>Nightcrawler</td>
                <td>D4CFEF02BE5AE171673BFC3FA2B8D8D7B64E6237</td>
              </tr>
              <tr>
                <td>Limitless</td>
                <td>D58506552443C08F303F6C2C7BA4F5046456BE77</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default SearchTorrent;
