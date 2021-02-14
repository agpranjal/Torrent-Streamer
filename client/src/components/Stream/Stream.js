import React from "react";
import Files from "../Files/Files";

import "../Files/Files.css";

class Stream extends React.Component {
    constructor(props) {
        super(props);

        this.videoRef = React.createRef();
        this.width = window.innerWidth;
        this.height = 80/100*window.innerHeight;
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
        else
            return (
                <video 
                ref={this.videoRef} 
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
