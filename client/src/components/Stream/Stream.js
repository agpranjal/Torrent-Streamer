import React from "react";
import Files from "../Files/Files";

import "../Files/Files.css";

class Stream extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            streaming: false,
            source: ""
        };

        this.videoRef = React.createRef();
        this.width = window.innerWidth;
        this.height = 80/100*window.innerHeight;
    }

    streamTorrent = (fileName) => {
        console.log("Streaming...");
        console.log(fileName);

        this.setState({
            streaming: true,
            source: `/stream/${this.props.magnetURI}/${fileName}`
        });
    }

    render() {

        // If files are being downloaded, but not streamed (ie, user has not selected which file to stream)
        if (!this.state.streaming)
            return <Files streamTorrent={this.streamTorrent} magnetURI={this.props.magnetURI} />;
        else
            return (
                <video ref={this.videoRef} height={this.height} width={this.width} autoplay controls id="player" src={this.state.source}></video>
            );

    }
}

export default Stream;