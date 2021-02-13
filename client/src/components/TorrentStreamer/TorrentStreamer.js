import React from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import SearchTorrent from "../SearchTorrent/SearchTorrent";
import Stream from "../Stream/Stream";

import "materialize-css/dist/css/materialize.min.css";
import "./TorrentStreamer.css";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            magnetURI: undefined,
            downloading: false,  // If the torrent has started downloading
            filesLoaded: false,
            filesList: []
        };
    }

    handleMagnetURIInput = (e) => {
        this.setState({
            magnetURI: e.target.value
        });
    }

    downloadTorrent = () => {
        // Tell the server to download the torrent

        if (!this.state.magnetURI.trim())
            return ;

        fetch(`add/${this.state.magnetURI}/`)
            .then((res) => {
                return res.json()
            })
            .then((filesList) => {
                filesList.sort();
                this.setState({filesLoaded: true});
                this.setState({filesList: filesList});
            })
            .catch((error) => {
                alert("Invalid Magnet URI / Info Hash");
                this.resetState();
            });

        this.setState({
            downloading: true
        });
    }

    resetState = () => {
        // Reset the states to default

        this.setState({
            magnetURI: undefined,
            downloading: false,
            filesLoaded: false,
            filesList: []
        })
    }

    deleteTorrent = () => {

        // Tell the server to stop downloading the torrent
        fetch(`/delete/${this.state.magnetURI}`);
        this.resetState();
    }

    componentDidMount() {
        // Tell the server to stop torrent download (if downloading) in case of refresh / reload

        window.addEventListener("unload", () => {
            if (this.state.magnetURI)
                fetch(`/delete/${this.state.magnetURI}`);
        });

        window.addEventListener("load", () => {
            if (this.state.magnetURI)
                fetch(`/delete/${this.state.magnetURI}`);
        });
    }

    render() {
        return (
            <div>
                <NavigationBar 
                deleteTorrent={this.deleteTorrent}
                downloading={this.state.downloading} />

                {
                    this.state.downloading ? 
                        <Stream 
                        filesList={this.state.filesList}
                        filesLoaded={this.state.filesLoaded}
                        magnetURI={this.state.magnetURI}
                        downloading={this.state.downloading} /> :

                        <SearchTorrent 
                        downloadTorrent={this.downloadTorrent} 
                        handleMagnetURIInput={this.handleMagnetURIInput} 
                        magnetURI={this.state.magnetURI} />
                }

                    </div>

        );
    }
}

export default App;
