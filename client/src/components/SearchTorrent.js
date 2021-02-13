import React from "react";
import "./SearchTorrent.css";

class SearchTorrent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <nav className="magnet-uri-container center">
                    <div className="nav-wrapper">
                        <form>
                            <div className="input-field">
                                <input  className="magnet-uri-input" defaultValue={this.props.magnetURI} onChange={this.props.handleMagnetURIInput} autoComplete="off" placeholder="Magnet URI / Info Hash" id="search" type="search" required />
                                <label className="label-icon" htmlFor="search"></label>
                                <i onClick={this.props.downloadTorrent} className="material-icons">download</i>
                            </div>
                        </form>
                    </div>
                </nav>


                <SampleTorrents />
            </div>
        );
    }
}

class SampleTorrents extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row center sample-torrent-container">
                <div className="col s12">
                    <table className="centered">
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
                                <td>Nightcrawler</td>
                                <td>D4CFEF02BE5AE171673BFC3FA2B8D8D7B64E6237</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        );
    }
}

export default SearchTorrent;
