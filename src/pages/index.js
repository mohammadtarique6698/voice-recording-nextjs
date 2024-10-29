import { useState } from "react";
import Navbar from "../components/NavBar";
import BabbleButton from "../components/BabbleButton";
import Waveform from "../components/Waveform";
import Footer from "@/components/Footer";

const HomePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isStopped, setIsStopped] = useState(false); // New state to manage stopped status

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsStopped(false); // Reset isStopped when starting a new recording
  };

  const handleStopRecording = () => {
    setIsRecording(false); // Stop recording
    setIsStopped(true); // Show "Done" and "Resume" buttons
  };

  const handleDone = () => {
    setIsRecording(false); // Reset both to stop recording completely
    setIsStopped(false);
  };

  const handleResume = () => {
    setIsRecording(true); // Resume recording
    setIsStopped(false);
  };

  return (
    <div
      className="h-full max-w-full"
      style={{ backgroundColor: "rgba(47, 72, 88, 1)" }}
    >
      <Navbar />
      {!isRecording && !isStopped ? (
        <BabbleButton onStartRecording={handleStartRecording} />
      ) : (
        <Waveform
          isRecording={isRecording}
          onStop={handleStopRecording}
          onDone={handleDone}
          onResume={handleResume}
          isStopped={isStopped}
        />
      )}
      <Footer />
    </div>
  );
};

export default HomePage;
