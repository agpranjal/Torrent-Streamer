import React from "react";
import Files from "../Files/Files";

import "../Files/Files.css";

class Stream extends React.Component {
    constructor(props) {
        super(props);

        this.height = 80/100*window.innerHeight;
        this.width = window.innerWidth;
    }

    render() {

        // If files are being downloaded, but not streaming (ie, user has not selected which file to stream)
        if (!this.props.streaming)
            return (
                <Files 
                filesList={this.props.filesList}
                filesLoaded={this.props.filesLoaded}
                streamTorrent={this.props.streamTorrent}
                setSource={this.props.setSource}
                magnetURI={this.props.magnetURI} />
            );

        // If a file in torrent has been selected to be streamed
        else
            return (
                <video 
                height={this.height} 
                width={this.width} 
                autoPlay={"on"} 
                controls 
                id="player" 
                src={this.props.source} />
            );
    }
}


export default Stream;
