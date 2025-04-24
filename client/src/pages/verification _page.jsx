import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam"; // You can replace this with a direct stream from DroidCam
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";

const FaceRecognition = () => {
  const [matchResult, setMatchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const webcamRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const [streamUrl, setStreamUrl] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("http://localhost:5000/attendance/today");
        const data = await response.json();
        setAttendance(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();

    setStreamUrl("http://192.168.88.254:4747/video");
  }, []);

  const captureImage = () => {
    if (!cameraOn || !imgRef.current) return;
  
    const canvas = canvasRef.current;
    const img = imgRef.current;
  
    if (img.complete && img.naturalHeight !== 0) {
      canvas.width = img.naturalHeight;
      canvas.height = img.naturalWidth;
  
      const ctx = canvas.getContext("2d");

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-90 * Math.PI / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  
      const imageSrc = canvas.toDataURL("image/jpeg");
      setIsLoading(true);
      verifyFace(imageSrc);
    } else {
      console.error("Image not loaded yet");
    }
  };
  

  const verifyFace = async (imageSrc) => {
    const formData = new FormData();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    formData.append("image", blob, "webcam_image.jpg");

    try {
      const response = await fetch("http://localhost:5000/verify-face", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.match) {
        setMatchResult(
          `✔️ ${data.first_name} ${data.last_name} | Date: ${data.date} | Time: ${data.time} | Score: ${data.score}`
        );
      } else {
        setMatchResult("❌ No match found");
      }
    } catch (error) {
      setMatchResult("❌ Error during verification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full space-x-8">
      <div className="w-[300px] h-[460px] p-6 bg-white rounded-xl shadow-md flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Today's Attendance</h2>
        <div className="flex-1 overflow-auto pr-2">
          {attendance.length === 0 ? (
            <p>No attendance recorded yet for today.</p>
          ) : (
            <ul className="space-y-2">
              {attendance.map((record, index) => (
                <li key={index}>
                  {record.first_name} {record.last_name} | Time: {record.time}
                </li>
              ))}
            </ul>
          )}
        </div>
        {isLoading && (
          <div className="mt-4 flex items-center">
            <div className="w-6 h-6 border-4 border-t-4 border-gray-500 border-solid rounded-full animate-spin mr-2"></div>
            <span>Loading...</span>
          </div>
        )}
        {matchResult && <h3 className="mt-4 text-lg">{matchResult}</h3>}
      </div>
      <div className="flex-1 p-6 bg-white rounded-xl shadow-md flex flex-col items-center">
        <div className="w-[480px] h-[360px] bg-gray-300 rounded-xl overflow-hidden flex justify-center items-center">
        {cameraOn ? (
            <>
              <img
                ref={imgRef}
                src={streamUrl}
                alt="DroidCam Stream"
                className="w-full h-full object-cover"
                crossOrigin="anonymous" 
                style={{ transform: "scaleX(-1)" , rotate :"90deg" }} 
              />
              <canvas 
                ref={canvasRef} 
                style={{ display: 'none' }}
              />
            </>
          ) : (
            <BsCameraVideoOff size={64} className="text-gray-600" />
          )}
        </div>

        <div className="mt-6 flex space-x-4 w-[480px]">
          <button
            onClick={captureImage}
            className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Capture and Verify
          </button>
          <button
            onClick={() => setCameraOn(!cameraOn)}
            className="w-12 h-12 bg-gray-100 text-gray-700 rounded-full flex justify-center items-center hover:bg-gray-200 transition"
          >
            {cameraOn ? (
              <BsCameraVideoOff size={20} />
            ) : (
              <BsCameraVideo size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
