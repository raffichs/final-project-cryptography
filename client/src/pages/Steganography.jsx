import { useState } from "react";
import axios from "axios";

function SteganographyUploader() {
  const [imageToHide, setImageToHide] = useState(null);
  const [encodedImage, setEncodedImage] = useState(null);
  const [decodedImage, setDecodedImage] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageToHide(file);
    setError("");
  };

  const handleUpload = async () => {
    if (!imageToHide) {
      setError("Please select an image to hide");
      return;
    }

    const formData = new FormData();
    formData.append("imageToHide", imageToHide);

    try {
      const response = await axios.post(
        "https://final-project-cryptography-server.vercel.app/encode",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setEncodedImage(`data:image/png;base64,${response.data.encodedImage}`);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error encoding image");
    }
  };

  const handleDecode = async (event) => {
    const encodedFile = event.target.files[0];
    if (!encodedFile) {
      setError("Please select an encoded image to decode");
      return;
    }

    const formData = new FormData();
    formData.append("encodedImage", encodedFile);

    try {
      const response = await axios.post(
        "https://final-project-cryptography-server.vercel.app/decode",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setDecodedImage(`data:image/png;base64,${response.data.decodedImage}`);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error decoding image");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Steganography Tool</h2>
      <div>
        <h3 className="text-lg mb-2">1. Encode an Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleUpload}
          disabled={!imageToHide}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Encode Image
        </button>
      </div>
      {encodedImage && (
        <div className="mt-4">
          <h3 className="text-lg mb-2">Encoded Image:</h3>
          <img
            src={encodedImage}
            alt="Encoded"
            className="max-w-full h-auto border rounded"
          />
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg mb-2">2. Decode an Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleDecode}
          className="mb-4"
        />
        {decodedImage && (
          <div className="mt-4">
            <h3 className="text-lg mb-2">Decoded Image:</h3>
            <img
              src={decodedImage}
              alt="Decoded"
              className="max-w-full h-auto border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SteganographyUploader;
