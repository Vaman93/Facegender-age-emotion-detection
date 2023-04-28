import * as faceapi from "face-api.js";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

let largest;
let emojiName = "no";

const lookup = {
  neutral: "😐",
  happy: "🙂",
  sad: "🙁",
  angry: "😠",
  fearful: "😨",
  disgusted: "😖",
  surprised: "😯",
};
function Emoji({ faces = {} }) {
  const str = emojiName || "";
  const str2 = str?.charAt(0)?.toUpperCase() + str?.slice(1);

  const setEmoji = (emojiName) => {
    if (emojiName === undefined) {
      return (
        <>
          <img
            style={{
              width: "88%",
              padding: " 1rem",
            }}
            src={process.env.PUBLIC_URL + "./img/1078.jpg"}
            alt=""
          />
          <p>Face not Detected</p>
        </>
      );
    }
    return (
      <>
        <p
          style={{
            fontSize: "8rem",
          }}
        >
          {lookup[emojiName]}
        </p>
        <h2>{str2}</h2>
      </>
    );
  };

  const faceName = () => {
    if (faces) {
      const facesKey = Object?.keys(faces);
      const facesValue = Object?.values(faces);

      emojiName = facesKey?.[0];
      largest = facesValue?.[0];

      if (facesValue) {
        for (let i = 1; i < facesValue.length; i++) {
          if (facesValue[i] > largest) {
            largest = facesValue[i];
            emojiName = facesKey[i];
          }
        }
      }
    }
    return setEmoji(emojiName);
  };

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      {faceName()}
    </div>
  );
}

const ShowAge = ({ age }) => {
  if (age === undefined) {
    return (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h1>Your Age</h1>
        <h2>Face not Detected</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <h1>Your Age</h1>
      <h2>{Math.round(age) - 5}</h2>
    </div>
  );
};

function Home() {
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);
  const navigate = useNavigate();

  const [detections, setDetections] = React.useState([]);

  const videoRef = React.useRef();
  const videoHeight = 600;
  const videoWidth = 820;
  const canvasRef = React.useRef();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "./models";
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    };
    loadModels();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
        setCaptureVideo(true);
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          videoRef.current
        );
        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender()
          .withFaceDescriptors();
        console.log("detections:", detections);

        setDetections(detections);

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        canvasRef &&
          canvasRef.current &&
          canvasRef.current
            .getContext("2d")
            .clearRect(0, 0, videoWidth, videoHeight);
        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

        resizedDetections.forEach((detection) => {
          const box = detection.detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, {
            label:
              Math.round(detection.age) - 5 + " year old " + detection.gender,
          });
          drawBox.draw(canvasRef?.current);
        });

        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawFaceExpressions(
            canvasRef.current,
            resizedDetections
          );
      }
    }, 400);
  };

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject?.getTracks()?.[0]?.stop();
    setCaptureVideo(false);
  };

  return (
    <div>
      <span
        onClick={() => {
          navigate("/documentation");
        }}
        style={{
          position: "absolute",
          cursor: "pointer",
          right: "5%",
          marginTop: "5px",
          borderRadius: "5px",
          padding: "1rem",
          fontWeight: "800",
          backgroundColor: "rgb(230 239 243)",
        }}
      >
        Documentation
      </span>
      <div style={{ textAlign: "center", padding: "10px" }}>
        {!captureVideo && (
          <h1
            style={{
              marginTop: "12rem",
              marginBottom: "6rem",
            }}
          >
            Realtime Gender, Age and Emotion Detection
          </h1>
        )}
        {captureVideo && modelsLoaded ? (
          <div onClick={closeWebcam} style={{ marginBottom: "5rem" }}>
            <button
              style={{
                cursor: "pointer",
                backgroundColor: " #e91109",
                color: "white",
                padding: "15px",
                fontSize: "25px",
                border: "none",
                borderRadius: "10px",
                position: "absolute",
                left: "42%",
                zIndex: "9999",
              }}
            >
              Close Webcam
            </button>
          </div>
        ) : (
          <button
            onClick={startVideo}
            style={{
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Start Webcam
          </button>
        )}
      </div>
      {captureVideo ? (
        modelsLoaded ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "20% 60% 20%",
              alignItems: "center",
              borderBottom: "1px solid black",
              paddingBottom: "0px",
            }}
          >
            <div
              style={{
                gridColumn: "span 3 / span 3",
                textAlign: "center",
                fontSize: "1.8rem",
                marginBottom: "5px",
              }}
            >
              {detections?.[0]?.gender ? (
                <>Gender: {detections?.[0]?.gender}</>
              ) : (
                <>Gender: Wait For a moment</>
              )}
            </div>

            <Emoji faces={detections?.[0]?.expressions} />
            <div>
              <video
                ref={videoRef}
                height={videoHeight - 90}
                width={videoWidth}
                onPlay={handleVideoOnPlay}
                style={{ borderRadius: "10px" }}
              />
              <canvas
                ref={canvasRef}
                style={{ position: "absolute", left: "20%", top: "5%" }}
              />

              <div
                style={{
                  position: "absolute",
                  left: "40%",
                  bottom: "3%",
                }}
              >
                <h3
                  style={{
                    textAlign: "center",
                    marginBottom: "6px",
                    marginLeft: "-8px",
                  }}
                >
                  How to use guide
                </h3>

                <ul
                  style={{
                    fontWeight: "800",
                    fontSize: "1.2rem",
                    color: "#464444",
                  }}
                >
                  <li>Make sure to Position yourself in center</li>
                  <li
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    Keep the head movement minimal
                  </li>
                </ul>
              </div>
            </div>
            <ShowAge age={detections?.[0]?.age} />
          </div>
        ) : (
          <div>loading...</div>
        )
      ) : (
        <></>
      )}
    </div>
  );
}

export default Home;
