import React from "react";
import "./Files.css";

class Files extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filesLoaded: false,
            filesList: []
        };
    }

    componentDidMount() {
        fetch(`add/${this.props.magnetURI}/`)
            .then((res) => res.json())
            .then((filesList) => {
                this.setState({filesLoaded: true});
                this.setState({filesList: filesList});
            })
            .catch((error) => console.log(error));
    }

    render() {

        // If files have not yet been obtained from the server, show the preloader
        if (!this.state.filesLoaded)
            return <Preloader />;
        else
            return (
                <div className="container torrent-file-list-container">
                    <ul className="flow-text center">
                        {this.state.filesList.map((f, idx) => {
                            if (f.endsWith(".mp4") || f.endsWith(".webm"))
                                return <li key={idx} onClick={() => this.props.streamTorrent(f)}><a href="#">{f}</a></li>;
                            else
                                return <li key={idx}>{f}</li>;
                        }
                        )}
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
