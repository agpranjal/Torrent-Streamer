import React from 'react';
import Files from '../Files/Files';

import './Stream.css';

class Stream extends React.Component {
  render() {
    return (
      <>
        <div className="row video-player-container">
          {this.props.streaming ? (
            <video className="col s12 m12 l8 offset-l2" autoPlay={'on'} controls id="player" src={this.props.source} />
          ) : null}
        </div>
        <Files
          filesList={this.props.filesList}
          filesLoaded={this.props.filesLoaded}
          streamTorrent={this.props.streamTorrent}
          setSource={this.props.setSource}
          magnetURI={this.props.magnetURI}
        />
      </>
    );
  }
}

export default Stream;
