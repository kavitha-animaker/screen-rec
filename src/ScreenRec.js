import React from "react";
import './screen.css';
import { BsRecordCircleFill } from 'react-icons/bs';
import { FaPauseCircle } from 'react-icons/fa';
import { GrResume } from 'react-icons/gr';

class ScreenRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaRecorder: null,
      videoModal: false
    };
  }

  async startRecordScreen() {
    let stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
      ? "video/webm; codecs=vp9"
      : "video/webm";
    let mediaRecorder = new MediaRecorder(stream, {
      mimeType: mime,
    });

    this.setState({
      mediaRecorder,
    });

    let chunks = [];
    mediaRecorder.addEventListener("dataavailable", function (e) {
      chunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop", function () {
      let blob = new Blob(chunks, {
        type: chunks[0].type,
      });
      let url = URL.createObjectURL(blob);

      let video = document.querySelector("video");
      video.src = url;

      let a = document.createElement("a");
      a.href = url;
      a.download = "video.webm";
      a.click();
    });

    mediaRecorder.start();
    this.setState({ videoModal: true })
  }

  async pause() {
    this.state.mediaRecorder.pause();
  }

  async resume() {
    this.state.mediaRecorder.resume();
  }

  render() {
    return (
      <div className="disp">
        <center> <h1>Screen Record</h1>
          <BsRecordCircleFill
            onClick={() => {
              this.startRecordScreen();
            }}
            className="rec-btn btn"
          />

          <FaPauseCircle
            className="pause-btn btn"
            disabled={!this.state.videoModal}
            onClick={() => {
              this.pause();
            }}
          />
          <GrResume
            disabled={!this.state.videoModal}
            className="res-btn btn"
            onClick={() => {
              this.resume();
            }}
          />
          {this.state.videoModal &&
            <div>
              <video controls autoPlay playsInline width={"50%"} height={"50%"} />
            </div>
          }
        </center>
      </div>
    );
  }
}

export default ScreenRecord;
