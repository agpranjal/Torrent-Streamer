import React from 'react';

import M from 'materialize-css';
import './NavigationBar.css';

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      torrentInfo: [],
    };

    this.modalRef = React.createRef();
  }

  torrentInfoModal = () => {
    if (this.props.downloading) {
      fetch(`/status/${this.props.magnetURI}/`)
        .then((res) => res.json())
        .then((torrent) => {
          this.setState({
            torrentInfo: [
              <li key={1}>
                <strong>Name: </strong>
                {torrent.name}
              </li>,
              <li key={2}>
                <strong>Magnet link: </strong>
                {torrent.magnetURI}
              </li>,
              <li key={3}>
                <strong>Info hash: </strong>
                {torrent.infoHash}
              </li>,
              <li key={4}>
                <strong>Downloaded: </strong>
                {torrent.downloaded} MB
              </li>,
              <li key={5}>
                <strong>Uploaded: </strong>
                {torrent.uploaded} MB
              </li>,
              <li key={6}>
                <strong>Download speed: </strong>
                {torrent.downloadSpeed} KB/s
              </li>,
              <li key={7}>
                <strong>Upload speed: </strong>
                {torrent.uploadSpeed} KB/s
              </li>,
              <li key={8}>
                <strong>Progress: </strong>
                {torrent.progress}%
              </li>,
              <li key={9}>
                <strong>No. of peers: </strong>
                {torrent.numPeers}
              </li>,
              <li key={15}>
                <strong>Seed ratio: </strong>
                {torrent.seedRatio}
              </li>,
              <li key={10}>
                <strong>Download location: </strong>
                {torrent.downloadLocation}
              </li>,
              <li key={11}>
                <strong>Total size: </strong>
                {torrent.totalSize} MB
              </li>,
              <li key={12}>
                <strong>Date of creation: </strong>
                {torrent.dateOfCreation}
              </li>,
              <li key={13}>
                <strong>Created by: </strong>
                {torrent.createdBy}
              </li>,
              <li key={14}>
                <strong>Comment: </strong>
                {torrent.comment}
              </li>,
            ],
          });
        });
    }
  };

  componentDidMount() {
    M.Modal.init(this.modalRef.current);
  }

  render() {
    let deleteTorrentButton;
    let torrentInfoButton;

    if (this.props.downloading) {
      deleteTorrentButton = (
        <ul className="right">
          <li onClick={this.props.deleteTorrent}>
            <a className="btn waves-effect red">
              <i className="material-icons right">delete</i>Delete Torrent
            </a>
          </li>
        </ul>
      );

      torrentInfoButton = (
        <ul className="right">
          <li onClick={this.torrentInfoModal}>
            <a className="waves-effect modal-trigger" href="#modal1">
              <i className="material-icons">description</i>
            </a>
          </li>
        </ul>
      );
    } else deleteTorrentButton = undefined;

    return (
      <>
        <nav className="navigation-bar">
          <div className="nav-wrapper">
            <a className="center brand-logo">T0rrent Stre4mer</a>

            {deleteTorrentButton}
            {torrentInfoButton}
          </div>
        </nav>

        <div ref={this.modalRef} id="modal1" className="modal torrent-info-container">
          <div className="modal-content">
            <Tabs setSource={this.props.setSource} torrentInfo={this.state.torrentInfo} filesList={this.props.filesList} />
          </div>

          <div className="modal-footer">
            <a href="#!" className="modal-close waves-effect btn-flat">
              Close
            </a>
          </div>
        </div>
      </>
    );
  }
}

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.tabsRef = React.createRef();
  }

  componentDidMount() {
    M.Tabs.init(this.tabsRef.current);
  }

  render() {
    return (
      <div className="row">
        <div className="col s12">
          <ul ref={this.tabsRef} className="tabs">
            <li className="tab col s3">
              <a className="active" href="#test1">
                Torrent Info
              </a>
            </li>
            <li className="tab col s3">
              <a href="#test2">Files</a>
            </li>
          </ul>
        </div>

        <div id="test1" className="col s12">
          <ul>{this.props.torrentInfo.map((e) => e)}</ul>
        </div>

        <div id="test2" className="col s12">
          <ul>
            {this.props.filesList.map((f, idx) => (
              <li key={idx}>
                {f.endsWith('.mp4') || f.endsWith('.webm') || f.endsWith('.ogg') || f.endsWith('.mp3') ? (
                  <a onClick={() => this.props.setSource(f)} href="#">
                    {f}
                  </a>
                ) : (
                  f
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default NavigationBar;
