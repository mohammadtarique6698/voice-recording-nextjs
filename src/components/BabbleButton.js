import { useState, useEffect } from "react";

import { PiGraph } from "react-icons/pi";
import { BsSoundwave } from "react-icons/bs";

const BabbleButton = ({ onStartRecording }) => {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (countdown === 0) {
      onStartRecording();
      setCountdown(null);
    }

    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, onStartRecording]);

  const handleButtonClick = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setCountdown(3))
      .catch((err) => alert("Mic permission denied!"));
  };

  return (
    <div className="w-full text-center text-white mt-4">
      <h1>Babble</h1>

      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: "rgba(47, 72, 88, 1)" }}
      >
        {countdown === null ? (
          <div
            className="border border-white rounded-lg flex justify-center items-center"
            style={{
              width: "80vw",
              height: "56vh",
              padding: "4vw",
            }}
          >
            <button
              onClick={handleButtonClick}
              className="rounded-full flex justify-center items-center text-xl font-bold bg-transparent text-white"
              style={{
                width: "5rem",
                height: "5rem",
                padding: "6rem",
                border: "0.25vw solid rgba(255, 182, 132, 1)",
              }}
            >
              Babble
            </button>
            <div className="absolute flex flex-row justify-center items-center gap-4 mt-96">
              <div
                className="rounded-full border border-white p-1 flex justify-center items-center"
                style={{ width: "3rem", height: "3rem" }}
                ng
              >
                <div
                  className="bg-black rounded-full flex justify-center items-center"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <PiGraph className="text-white text-xl" />
                </div>
              </div>
              <div
                className="rounded-full border border-white p-1 flex justify-center items-center"
                style={{ width: "3rem", height: "3rem" }}
              >
                <div
                  className="bg-black rounded-full flex justify-center items-center"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <BsSoundwave className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center items-center font-bold text-gray-700 bg-white h-32 w-32 rounded-full"
            style={{ fontSize: "1rem" }}
          >
            {countdown}
          </div>
        )}
      </div>
    </div>
  );
};

export default BabbleButton;
