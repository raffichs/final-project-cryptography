import { useEffect, useState } from "react";
import CryptoJS from "crypto-js"; // Import AES encryption library
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SubmitForm() {
  const [formData, setFormData] = useState({
    name: "",
    recipient: "",
    confession: "",
    passkey: "",
    clue: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        axios.defaults.withCredentials = true;

        const response = await axios.get("http://localhost:5000/protected", {
          withCredentials: true, // Include cookies in the request
        });
        console.log(response.data); // Log authenticated user data
      } catch (err) {
        console.error(err.response?.data?.message || "Unauthorized");
        navigate("/"); // Redirect to login if not authenticated
      }
    };

    checkAuth();
  }, [navigate]);

  // Caesar Cipher Function
  const caesarCipher = (text, shift) => {
    return text
      .split("")
      .map((char) => {
        const charCode = char.charCodeAt(0);
        if (charCode >= 65 && charCode <= 90) {
          // Uppercase letters
          return String.fromCharCode(((charCode - 65 + shift) % 26) + 65);
        } else if (charCode >= 97 && charCode <= 122) {
          // Lowercase letters
          return String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
        }
        return char; // Non-alphabet characters remain unchanged
      })
      .join("");
  };

  // AES Encryption Function
  const aesEncrypt = (text, passphrase) => {
    return CryptoJS.AES.encrypt(text, passphrase).toString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const shiftedConfession = caesarCipher(formData.confession, 3);
    console.log("Shifted Confession:", shiftedConfession);

    const encryptedConfession = aesEncrypt(shiftedConfession, formData.passkey);

    const dataToSubmit = {
      ...formData,
      confession: encryptedConfession,
    };

    try {
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Confession submitted successfully!");
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      alert("Error submitting form: " + error.message);
    }
  };

  return (
    <div>
      <div className="border-b-[1px] border-gray-300 p-6">
        <h1 className="reenie-beanie-regular text-4xl">Confessit!</h1>
      </div>

      <div className="flex flex-col items-center mt-4">
        <form
          className="flex flex-col gap-2 my-4 w-3/4"
          onSubmit={handleSubmit}
        >
          <label htmlFor="name">What is your name?</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mb-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-3 py-2"
            placeholder="Your Name (will be encrypted)"
            required
          />

          <label htmlFor="recipient">Who are you confessing to?</label>
          <input
            type="text"
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            className="mb-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-3 py-2"
            placeholder="Name"
            required
          />

          <label htmlFor="confession">Write your confession</label>
          <textarea
            name="confession"
            value={formData.confession}
            onChange={handleChange}
            className="mb-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-3 py-2"
            placeholder="Confession (will be encrypted)"
            required
          ></textarea>

          <label htmlFor="passkey">
            Give your confession a passkey only they know
          </label>
          <input
            type="text"
            name="passkey"
            value={formData.passkey}
            onChange={handleChange}
            className="mb-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-3 py-2"
            placeholder="Passkey"
            required
          />

          <label htmlFor="clue">Help them with a clue</label>
          <input
            type="text"
            name="clue"
            value={formData.clue}
            onChange={handleChange}
            className="mb-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-3 py-2"
            placeholder="Clue"
            required
          />

          <button
            type="submit"
            className="mb-10 inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="border-t-[1px] border-gray-300 p-6 flex justify-end">
        <h1 className="reenie-beanie-regular text-4xl">Confessit!</h1>
      </div>
    </div>
  );
}
