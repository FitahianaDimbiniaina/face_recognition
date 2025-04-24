import React, { useState, useRef, useEffect } from "react";
import { BsCamera } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    img_ref: null,
  });
  const [useCamera, setUseCamera] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const [streamUrl, setStreamUrl] = useState(null);

  useEffect(() => {
    setStreamUrl("http://192.168.88.254:4747/video"); 
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "img_ref") {
      setFormData({ ...formData, img_ref: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const captureImage = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas || !img.complete || img.naturalHeight === 0) return;

    canvas.width = img.naturalHeight;
    canvas.height = img.naturalWidth;

    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-90 * Math.PI / 180); 
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    const imageSrc = canvas.toDataURL("image/jpeg");
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const safeName = `${formData.first_name}_${formData.last_name}`.replace(/\s+/g, "_");
        const file = new File([blob], `${safeName}.jpg`, { type: "image/jpeg" });
        setFormData({ ...formData, img_ref: file });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.img_ref) {
      setStatus("Image is required.");
      return;
    }

    const data = new FormData();
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("img_ref", formData.img_ref);

    try {
      const response = await fetch("http://localhost:5000/create_user", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        setStatus("User created successfully.");
        setFormData({ first_name: "", last_name: "", img_ref: null });
        setTimeout(() => navigate("/user"), 1000);
      } else {
        setStatus(result.error || "Failed to create user.");
      }
    } catch (error) {
      setStatus("Error creating user.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
          required
        />

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Use Camera?</span>
          <button
            type="button"
            onClick={() => setUseCamera(!useCamera)}
            className="text-purple-600 text-sm hover:underline"
          >
            {useCamera ? "Disable" : "Enable"}
          </button>
        </div>
        {useCamera ? (
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
           <div className="flex justify-center items-center max-h-96 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
              <div className="transform -rotate-90">
                <img
                  ref={imgRef}
                  src={streamUrl}
                  alt="IP Camera Stream"
                  className="h-[400px] object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <button
              type="button"
              onClick={captureImage}
              className="mt-2 w-full py-2 bg-purple-600 text-white rounded-xl flex items-center justify-center gap-2"
            >
              <BsCamera size={18} />
              Capture
            </button>
          </div>
        ) : (
          <input
            type="file"
            name="img_ref"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
            required
          />
        )}

                <button
          type="submit"
          className="w-full py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          Create User
        </button>

        {status && (
          <p className="text-sm text-center text-gray-600">{status}</p>
        )}
      </form>
    </div>
  );
};

export default AddUser;