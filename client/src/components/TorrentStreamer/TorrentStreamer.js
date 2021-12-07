import React from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import SearchTorrent from '../SearchTorrent/SearchTorrent';
import Stream from '../Stream/Stream';
import BrowseTorrent from '../BrowseTorrent/BrowseTorrent';

import 'materialize-css/dist/css/materialize.min.css';
import './TorrentStreamer.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      magnetURI: '', // Magnet URI / Info Hash of the torrent
      downloading: false, // If the torrent has started downloading
      filesLoaded: false, // If the front-end has obtained list of files from the server
      filesList: [], // List of files in the torrent
      fileName: '', // Currently streaming file name
      streaming: false, // If a file in torrent is currently being streamed
      source: '', // source url for video tag
      browsing: false, // if torrent is being browsed
    };
  }

  streamTorrent = (fileName) => {
    this.setState({
      fileName: fileName,
      streaming: true,
      source: `/stream/${this.state.magnetURI}/${fileName}`,
    });
  };

  handleMagnetURIInput = (e) => {
    this.setState({
      magnetURI: e.target.value,
    });
  };

  disableBrowsing = () => {
    this.setState({
      browsing: false,
    });
  };

  downloadTorrent = async () => {
    // Tell the server to download the torrent

    if (!this.state.magnetURI.trim()) return;

    try {
      this.setState({ downloading: true });

      const filesList = await fetch(`/add/${this.state.magnetURI}/`).then((res) => res.json());
      filesList.sort();

      this.setState({
        filesList,
        filesLoaded: true,
      });
    } catch (error) {
      console.log(error);
      alert('Invalid Magnet URI / Info Hash');
      this.resetState();
    }
  };

  setSource = (f) => {
    this.setState({
      source: `/stream/${this.state.magnetURI}/${f}`,
    });
  };

  setMagnetURI = (magnetURI) => {
    this.setState({
      magnetURI,
    });
  };

  deleteTorrent = () => {
    // Tell the server to stop downloading the torrent

    fetch(`/delete/${this.state.magnetURI}`);
    this.resetState();
  };

  browseTorrent = () => {
    this.setState({
      browsing: true,
    });
  };

  resetState = () => {
    // Reset the states to default

    this.setState({
      magnetURI: '',
      downloading: false,
      filesLoaded: false,
      streaming: false,
      filesList: [],
      fileName: '',
      source: '',
      browsing: false,
    });
  };

  componentDidMount() {
    // Tell the server to stop torrent download (if downloading) in case of refresh / reload

    window.addEventListener('unload', () => {
      if (this.state.magnetURI) {
        fetch(`/delete/${this.state.magnetURI}`);
        this.resetState();
      }
    });

    window.addEventListener('load', () => {
      if (this.state.magnetURI) {
        fetch(`/delete/${this.state.magnetURI}`);
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
          filesList={this.state.filesList}
          browseTorrent={this.browseTorrent}
          resetState={this.resetState}
        />

        {this.state.browsing ? (
          <BrowseTorrent
            disableBrowsing={this.disableBrowsing}
            downloadTorrent={this.downloadTorrent}
            setMagnetURI={this.setMagnetURI}
          ></BrowseTorrent>
        ) : this.state.downloading ? (
          <Stream
            filesList={this.state.filesList}
            filesLoaded={this.state.filesLoaded}
            streamTorrent={this.streamTorrent}
            streaming={this.state.streaming}
            source={this.state.source}
            filename={this.state.fileName}
            magnetURI={this.state.magnetURI}
            downloading={this.state.downloading}
          />
        ) : (
          <SearchTorrent
            downloadTorrent={this.downloadTorrent}
            handleMagnetURIInput={this.handleMagnetURIInput}
            magnetURI={this.state.magnetURI}
          />
        )}
      </div>
    );
  }
}

export default App;
