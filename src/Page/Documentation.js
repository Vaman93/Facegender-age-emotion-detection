import React from "react";
import { useNavigate } from "react-router-dom";

const techStackArray = [
  {
    name: "React js",
    img: "./img/reactlogo.png",
  },
  {
    name: "Html",
    img: "./img/html.png",
  },
  {
    name: "Css",
    img: "./img/css.png",
  },
  {
    name: "JavaScript",
    img: "./img/javascript.png",
  },
  {
    name: "Face Api",
    img: "./img/api.png",
  },
  {
    name: "Tensorflow",
    img: "./img/tensorflow.png",
  },
];

export default function Documentation() {
  const navigate = useNavigate();
  return (
    <>
      <span
        onClick={() => {
          navigate("/");
        }}
        style={{
          position: "absolute",
          cursor: "pointer",
          left: "5%",
          borderRadius: "5px",
          padding: "1rem",
          fontWeight: "800",
          backgroundColor: "rgb(230 239 243)",
        }}
      >
        Home
      </span>
      <div>
        <h1
          style={{
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Tech Stack
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "14% 14% 14%",
            justifyContent: "center",
            padding: "1rem",
            gap: "5rem",
          }}
        >
          {techStackArray?.map((e) => {
            return (
              <div
                style={{
                  textAlign: "center",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: "rgb(234 234 234 / 41%)",
                  boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <img
                  src={process.env.PUBLIC_URL + e.img}
                  style={{
                    width: "70%",
                  }}
                  alt="#"
                />

                <p
                  style={{
                    fontSize: "1.4rem",
                    paddingTop: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  {e.name}
                </p>
              </div>
            );
          })}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "1.4rem",
          }}
        >
          <h2>More Info</h2>
          <p>
            <ul
              style={{
                textAlign: "left",
                padding: "10px",
                paddingLeft: "2.3rem",
                paddingRight: "2.3rem",
              }}
            >
              <li>
                Real-time gender, age, and emotion detection technology use
                computer vision and machine learning algorithms to analyze
                facial features and provide information about a person's gender,
                age range, and emotional state.
              </li>
              <li>
                Gender detection algorithms analyze facial characteristics such
                as the shape of the jaw, the width of the forehead, and the size
                of the eyes to determine if the person is male or female.
              </li>

              <li>
                Age detection algorithms use facial landmarks such as wrinkles,
                fine lines, and sagging skin to estimate a person's age range.
                This is typically done by comparing the person's features to a
                database of images with known ages.
              </li>
            </ul>
          </p>
        </div>
      </div>
    </>
  );
}
