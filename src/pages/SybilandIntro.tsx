import { useEffect, useRef, useState } from "react";
import sybiland_intro from "../assets/sybiland-intro-720.mp4";
import sybiland_map from "../assets/map-compressed.jpeg";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const SybilandIntro = () => {
  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(false);
  const videoRef = useRef(null);
  const small = useMediaQuery({ query: "(max-width: 850px)" });

  useEffect(() => {
    if (small) {
      setShowImage(true);
    } else if (videoRef.current) {
      //@ts-ignore
      videoRef.current.addEventListener("ended", () => {
        setShowImage(true);
        console.log("Video ended");
      });
    }
  }, []);
  return (
    <div className="background-container">
      <img src={sybiland_map} className="background-image" />
      <div className="aether-ritual-sign" onClick={() => navigate("/mint")} />

      {!showImage && (
        <video ref={videoRef} autoPlay muted className="background-video">
          <source src={sybiland_intro} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default SybilandIntro;
