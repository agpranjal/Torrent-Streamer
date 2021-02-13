import React from "react";
import NavigationBar from "./NavigationBar";
import SearchTorrent from "./SearchTorrent";
import Stream from "./Stream";

import "materialize-css/dist/css/materialize.min.css";
import "./TorrentStreamer.css";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            magnetURI: undefined,
            downloading: false
        };
    }

    handleMagnetURIInput = (e) => {
        this.setState({
            magnetURI: e.target.value
        });
    }

    downloadTorrent = () => {
        this.setState({
            downloading: true
        });
    }

    deleteTorrent = () => {

        // Tell the server to stop downloading the torrent
        fetch(`/delete/${this.state.magnetURI}`)
            .then((res) => {

                // Reset the states to default
                this.setState({
                    magnetURI: undefined,
                    downloading: false
                });

            });

    }

    render() {
        return (
            <div>
                <NavigationBar deleteTorrent={this.deleteTorrent} downloading={this.state.downloading} />
                {
                    this.state.downloading ? <Stream magnetURI={this.state.magnetURI} downloading={this.state.downloading} /> : <SearchTorrent downloadTorrent={this.downloadTorrent} handleMagnetURIInput={this.handleMagnetURIInput} magnetURI={this.state.magnetURI} />
                }
                </div>

        );
    }
}

export default App;
