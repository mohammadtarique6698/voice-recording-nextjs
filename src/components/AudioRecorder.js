import React, { useState, useEffect, useRef } from "react";

const AudioRecorder = ({ isRecording, onStop }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [volumeArray, setVolumeArray] = useState([]);
  const [isStopped, setIsStopped] = useState(false); // Track if recording is stopped
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startRecording();
      setIsStopped(false);
    } else if (!isStopped) {
      stopRecording();
    }
    return () => {
      stopRecording();
    };
  }, [isRecording]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    setAudioChunks([]);

    // Set up Web Audio API for volume visualization
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    analyser.fftSize = 512;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    microphone.connect(analyser);
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    microphoneRef.current = microphone;
    dataArrayRef.current = dataArray;

    // Animation loop to update volume array
    const updateWaveform = () => {
      analyser.getByteFrequencyData(dataArray);
      const avgVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setVolumeArray((prev) => [...prev.slice(-40), avgVolume]); // Keep last 40 volumes
      animationFrameIdRef.current = requestAnimationFrame(updateWaveform);
    };
    updateWaveform();

    // Start recording
    recorder.ondataavailable = (event) => {
      setAudioChunks((prev) => [...prev, event.data]);
    };
    recorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsStopped(true); // Mark recording as stopped to show Done/Resume buttons
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        localStorage.setItem("recordedAudio", audioUrl);
        if (onStop) onStop({ blob: audioBlob });
      };
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
      cancelAnimationFrame(animationFrameIdRef.current);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-1/3 bg-transparent">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full fill-current text-yellow-400"
      >
        <path
          d={`
            M 0,100 
            ${volumeArray.map((v, i) => `${i * 6},${100 - v}`).join(" ")}
            L 100,100 Z
          `}
          fill={
            isRecording ? "rgba(29, 78, 216, 0.5)" : "rgba(255, 255, 255, 1)"
          }
          stroke="none"
        />
        <polyline
          fill="none"
          stroke="#1DA1F2"
          strokeWidth="2"
          points={volumeArray.map((v, i) => `${i * 6},${100 - v}`).join(" ")}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          className="stroke-current"
          style={{
            animation: isRecording ? "wave 1s ease-in-out infinite" : "none",
            stroke: isRecording ? "yellow" : "#1DA1F2",
          }}
        />
      </svg>
    </div>
  );
};

export default AudioRecorder;

// import React, { useState, useEffect, useRef } from "react";

// const AudioRecorder = ({ isRecording, onStop }) => {
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioChunks, setAudioChunks] = useState([]);
//   const [volumeArray, setVolumeArray] = useState([]);
//   const [isPaused, setIsPaused] = useState(false); // State to track if recording is paused
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const microphoneRef = useRef(null);
//   const dataArrayRef = useRef(null);
//   const animationFrameIdRef = useRef(null);

//   useEffect(() => {
//     if (isRecording) {
//       startRecording();
//     } else {
//       stopRecording();
//     }
//     return () => {
//       stopRecording();
//     };
//   }, [isRecording]);

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);
//     setMediaRecorder(recorder);
//     setAudioChunks([]);

//     // Web Audio API for volume monitoring
//     const audioContext = new (window.AudioContext || window.AudioContext)();
//     const analyser = audioContext.createAnalyser();
//     const microphone = audioContext.createMediaStreamSource(stream);
//     analyser.fftSize = 512;
//     const dataArray = new Uint8Array(analyser.frequencyBinCount);

//     microphone.connect(analyser);
//     audioContextRef.current = audioContext;
//     analyserRef.current = analyser;
//     microphoneRef.current = microphone;
//     dataArrayRef.current = dataArray;

//     // Animation loop to update volume array
//     const updateWaveform = () => {
//       analyser.getByteFrequencyData(dataArray);
//       const avgVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
//       setVolumeArray((prev) => [...prev.slice(-40), avgVolume]); // Keep last 40 volumes
//       animationFrameIdRef.current = requestAnimationFrame(updateWaveform);
//     };
//     updateWaveform();

//     // Start recording
//     recorder.ondataavailable = (event) => {
//       setAudioChunks((prev) => [...prev, event.data]);
//     };
//     recorder.start();
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
//         const audioUrl = URL.createObjectURL(audioBlob);
//         localStorage.setItem("recordedAudio", audioUrl);
//         if (onStop) onStop({ blob: audioBlob });
//       };
//       if (audioContextRef.current) {
//         audioContextRef.current.close();
//       }
//       cancelAnimationFrame(animationFrameIdRef.current);
//     }
//   };

//   const handleResume = () => {
//     if (mediaRecorder && isPaused) {
//       mediaRecorder.resume();
//       setIsPaused(false); // Update state to indicate that recording is resumed
//     }
//   };

//   const handleDone = () => {
//     stopRecording(); // Call stop recording when done
//     setIsPaused(false); // Reset pause state
//   };

//   const handlePause = () => {
//     if (mediaRecorder) {
//       mediaRecorder.pause();
//       setIsPaused(true); // Update state to indicate that recording is paused
//     }
//   };

//   return (
//     <div className="fixed bottom-0 left-0 w-full h-1/3 bg-transparent">
//       <svg
//         viewBox="0 0 100 100"
//         preserveAspectRatio="none"
//         className="h-full w-full fill-current text-blue-400"
//       >
//         {/* Path to fill the area under the stroke */}
//         <path
//           d={`
//             M 0,100
//             ${volumeArray.map((v, i) => `${i * 5},${100 - v}`).join(" ")}
//             L 100,100 Z
//           `}
//           fill={
//             isRecording ? "rgba(255, 255, 0, 0.5)" : "rgba(29, 78, 216, 0.5)"
//           }
//           stroke="none"
//         />
//         <polyline
//           fill="none"
//           stroke="#1DA1F2"
//           strokeWidth="2"
//           points={volumeArray.map((v, i) => `${i * 5},${100 - v}`).join(" ")}
//           vectorEffect="non-scaling-stroke"
//           strokeLinecap="round"
//           className="stroke-current"
//           style={{
//             animation: isRecording ? "wave 1s ease-in-out infinite" : "none",
//             stroke: isRecording ? "yellow" : "#1DA1F2",
//           }}
//         />
//       </svg>

//       {/* Action Buttons */}
//       <div className="absolute inset-0 flex flex-col justify-center items-center">
//         {!isPaused && (
//           <button
//             onClick={handlePause}
//             className="m-2 p-2 bg-red-500 text-white rounded"
//           >
//             Pause
//           </button>
//         )}
//         {isPaused && (
//           <button
//             onClick={handleResume}
//             className="m-2 p-2 bg-green-500 text-white rounded"
//           >
//             Resume
//           </button>
//         )}
//         <button
//           onClick={handleDone}
//           className="m-2 p-2 bg-blue-500 text-white rounded"
//         >
//           Done
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AudioRecorder;
