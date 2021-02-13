import React from "react";
import "./NavigationBar.css";

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let deleteTorrentButton;

        if (this.props.downloading)
            deleteTorrentButton = (
                <ul className="right">
                    <li onClick={this.props.deleteTorrent}><a className="btn waves-effect red"><i className="material-icons right">delete</i>Delete Torrent</a></li>
                </ul>
            );
        else
            deleteTorrentButton = undefined;

        return (

            <nav className="navigation-bar">
                <div className="nav-wrapper">
                    <a className="center brand-logo">T0rrent Stre4mer</a>
                    <ul id="nav-mobile" className="left hide-on-med-and-down"></ul>

                    {deleteTorrentButton}
                </div>
            </nav>
        );
    }
}

export default NavigationBar;
