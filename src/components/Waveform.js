import React from "react";
import AudioRecorder from "./AudioRecorder";
import { IoTrashBinOutline } from "react-icons/io5";

const Waveform = ({ isRecording, onStop, onDone, onResume, isStopped }) => {
  return (
    <div
      className="relative h-screen flex flex-col justify-center"
      style={{ backgroundColor: "rgba(47, 72, 88, 1)" }}
    >
      <AudioRecorder isRecording={isRecording} />

      <div className="absolute inset-0 flex flex-col justify-center items-center gap-5">
        {isRecording && !isStopped ? (
          <button
            onClick={onStop}
            className="w-40 h-40 bg-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold text-black"
          >
            Stop
          </button>
        ) : isStopped ? (
          <div className="flex flex-col items-center justify-center gap-10">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={onDone}
                className="w-48 h-48 bg-white text-black rounded-full shadow-lg text-md font-bold"
              >
                Done
              </button>
              <button
                onClick={onResume}
                className="w-24 h-24 bg-yellow-400 text-white rounded-full shadow-lg text-md font-bold"
                style={{ backgroundColor: "rgba(255, 185, 138, 1)" }}
              >
                Resume
              </button>
            </div>
            <div className="h-10 w-10 rounded-full bg-white text-yellow-300 flex justify-center items-center">
              <IoTrashBinOutline />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Waveform;
