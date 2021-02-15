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
            magnetURI: "",       // Magnet URI / Info Hash of the torrent
            downloading: false,  // If the torrent has started downloading
            filesLoaded: false,  // If the front-end has obtained list of files from the server
            filesList: [],       // List of files in the torrent
            fileName: "",        // Currently streaming file name
            streaming: false,    // If a file in torrent is currently being streamed
            source: "",          // source url for video tag
        };
    }

    streamTorrent = (fileName) => {
        this.setState({
            fileName: fileName,
            streaming: true,
            source: `http://localhost:8001/stream/${this.state.magnetURI}/${fileName}`
        })
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

        fetch(`http://localhost:8001/add/${this.state.magnetURI}/`)
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

    setSource = (f) => {
        this.setState({
            source: `http://localhost:8001/stream/${this.state.magnetURI}/${f}`
        });
    }

    deleteTorrent = () => {
        // Tell the server to stop downloading the torrent

        fetch(`http://localhost:8001/delete/${this.state.magnetURI}`);
        this.resetState();
    }


    resetState = () => {
        // Reset the states to default

        this.setState({
            magnetURI: "",
            downloading: false,
            filesLoaded: false,
            streaming: false,
            filesList: [],
            fileName: "",
            source: "",
        });
    }

    componentDidMount() {
        // Tell the server to stop torrent download (if downloading) in case of refresh / reload

        window.addEventListener("unload", () => {
            if (this.state.magnetURI) {
                fetch(`http://localhost:8001/delete/${this.state.magnetURI}`);
                this.resetState();
            }
        });

        window.addEventListener("load", () => {
            if (this.state.magnetURI) {
                fetch(`http://localhost:8001/delete/${this.state.magnetURI}`);
                this.resetState();
            }
        });
    }

    render() {
        return (
            <div>
                <NavigationBar 
                magnetURI={this.state.magnetURI}
                deleteTorrent={this.deleteTorrent}
                downloading={this.state.downloading}
                filesLoaded={this.state.filesLoaded}
                setSource={this.setSource}
                filesList={this.state.filesList} />

                {
                    this.state.downloading ? 
                        <Stream 
                        filesList={this.state.filesList}
                        filesLoaded={this.state.filesLoaded}
                        streamTorrent={this.streamTorrent}
                        streaming={this.state.streaming}
                        source={this.state.source}
                        filename={this.state.fileName}
                        magnetURI={this.state.magnetURI}
                        downloading={this.state.downloading} />

                        :

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
