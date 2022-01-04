import React from 'react';
import MoonLoader from 'react-spinners/HashLoader';

import './Files.css';

const override = `
  display: block;
  margin: auto;
  position: relative;
  top: 35vh;
`;

class Files extends React.Component {
  render() {
    return (
      <>
        <MoonLoader css={override} size={100} loading={!this.props.filesLoaded} speedMultiplier={1} />
        {this.props.filesLoaded ? (
          <div className="row">
            <div className="col s12 m12 l8 offset-l2 files-list-container">
              <span className="files">
                <i className="material-icons files-icon">file_copy</i>
                Files
              </span>
              <table className="responsive file-names">
                <tbody>
                  {this.props.filesList.map((f, idx) => {
                    if (f.endsWith('.mp4') || f.endsWith('.webm') || f.endsWith('.ogg') || f.endsWith('.mp3'))
                      return (
                        <tr key={idx} onClick={() => this.props.streamTorrent(f)}>
                          <td>
                            <a href="#">{f}</a>
                          </td>
                        </tr>
                      );
                    else
                      return (
                        <tr key={idx}>
                          <td>{f}</td>
                        </tr>
                      );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

export default Files;
