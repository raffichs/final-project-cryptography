import { useState } from "react";
import CryptoJS from "crypto-js"; // Import AES encryption library

export default function DecryptForm() {
  const [formData, setFormData] = useState({
    encryptedConfession: "",
    passkey: "",
  });

  const [decryptedMessage, setDecryptedMessage] = useState("");

  // Caesar Cipher Decoding Function (reverse shift)
  const caesarDecipher = (text, shift) => {
    return text
      .split("")
      .map((char) => {
        const charCode = char.charCodeAt(0);
        if (charCode >= 65 && charCode <= 90) {
          // Uppercase letters
          return String.fromCharCode(((charCode - 65 - shift + 26) % 26) + 65);
        } else if (charCode >= 97 && charCode <= 122) {
          // Lowercase letters
          return String.fromCharCode(((charCode - 97 - shift + 26) % 26) + 97);
        }
        return char; // Non-alphabet characters remain unchanged
      })
      .join("");
  };

  // AES Decryption Function
  const aesDecrypt = (ciphertext, passphrase) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Decrypt the confession with AES using the passkey
    const decryptedWithAES = aesDecrypt(
      formData.encryptedConfession,
      formData.passkey
    );

    // Decode the Caesar cipher (reverse shift of 3)
    const decryptedMessage = caesarDecipher(decryptedWithAES, 3);
    setDecryptedMessage(decryptedMessage);
  };

  return (
    <div>
      <div className="border-b-[1px] border-gray-300 p-6">
        <h1>Decrypt the Confession</h1>
      </div>

      <div className="flex flex-col items-center mt-4">
        <form
          className="flex flex-col gap-2 my-4 w-3/4"
          onSubmit={handleSubmit}
        >
          <label htmlFor="encryptedConfession">
            Enter the encrypted confession:
          </label>
          <textarea
            name="encryptedConfession"
            value={formData.encryptedConfession}
            onChange={handleChange}
            className="mb-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-3 py-2"
            placeholder="Encrypted Confession"
            required
          ></textarea>

          <label htmlFor="passkey">Enter the passkey:</label>
          <input
            type="text"
            name="passkey"
            value={formData.passkey}
            onChange={handleChange}
            className="mb-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-3 py-2"
            placeholder="Passkey"
            required
          />

          <button
            type="submit"
            className="mb-16 inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"
          >
            Decrypt
          </button>
        </form>

        {decryptedMessage && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg">
            <h2>Decrypted Message:</h2>
            <p>{decryptedMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
