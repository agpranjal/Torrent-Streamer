import React from 'react';
import './Files.css';

class Files extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // If files have not yet been obtained from the server, show the preloader
    if (!this.props.filesLoaded) return <Preloader />;
    // Show the available files in torrent
    else
      return (
        <div className="container torrent-file-list-container">
          <ul className="center">
            {this.props.filesList.map((f, idx) => {
              if (f.endsWith('.mp4') || f.endsWith('.webm') || f.endsWith('.ogg') || f.endsWith('.mp3'))
                return (
                  <li key={idx} onClick={() => this.props.streamTorrent(f)}>
                    <a href="#">{f}</a>
                  </li>
                );
              else return <li key={idx}>{f}</li>;
            })}
          </ul>
        </div>
      );
  }
}

class Preloader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="preloader">
        <span>↓</span>
        <span>↓</span>
        <span>↓</span>
        <span>↓</span>
        <span>↓</span>
      </div>
    );
  }
}

export default Files;
