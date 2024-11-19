import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";

export default function DecryptionPage() {
  const { id } = useParams();
  const [confession, setConfession] = useState(null);
  const [passkey, setPasskey] = useState("");
  const [decryptedConfession, setDecryptedConfession] = useState("");
  const [error, setError] = useState("");
  const [decryptedWithAES, setDecryptedWithAES] = useState("");

  useEffect(() => {
    const fetchConfession = async () => {
      try {
        const response = await axios.get(
          `https://final-project-cryptography-server.vercel.app/confessions/${id}`
        );
        setConfession(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConfession();
  }, [id]);

  // Caesar Cipher Decoding Function
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
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      throw new Error("Decryption failed", err);
    }
  };

  const handleDecrypt = async (e) => {
    e.preventDefault();
    try {
      // First decrypt with AES using the passkey
      const decryptedWithAES = aesDecrypt(confession.confession, passkey);
      setDecryptedWithAES(decryptedWithAES);

      // Then decrypt with Caesar cipher (shift of 3)
      const finalDecrypted = caesarDecipher(decryptedWithAES, 3);

      setDecryptedConfession(finalDecrypted);
      setError("");
    } catch (err) {
      setError("Invalid passkey or decryption failed. Try again!", err);
      setDecryptedConfession("");
    }
  };

  return (
    <div>
      <div className="border-b-[1px] border-gray-300 p-6">
        <h1 className="reenie-beanie-regular text-4xl">confessit!</h1>
      </div>

      <div className="max-w-2xl m-auto p-6">
        {confession ? (
          <div>
            <h1 className="text-xl text-gray-800 mb-4">
              Hello,{" "}
              <span className="reenie-beanie-regular text-4xl ">
                {confession.recipient}
              </span>
            </h1>
            <div>
              There&apos;s someone confessing their feelings to you. Try to find
              the passkey using the clue sender provided. Good luck!
            </div>
            <div className="">
              <div className="text-gray-800 font-medium mt-4 mb-2">
                here&apos;s the encrypted message for you:
              </div>
              <div className="relative w-full">
                <div className="italic underline text-gray-800">
                  <div className="overflow-hidden">
                    <div className="break-words whitespace-pre-line font-geist">
                      {confession.confession}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleDecrypt} className="mt-8">
              <div>
                <label htmlFor="passkey" className="block text-gray-600">
                  Enter the passkey using the clue provided
                </label>
                <div>
                  <p className="font-medium">Clue: {confession.clue}</p>
                </div>
              </div>
              {error && <p className="text-red-600">{error}</p>}
              <div className="flex h-11 gap-2 mt-2">
                <input
                  type="text"
                  id="passkey"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="w-full shadow-sm bg-white border border-gray-300 text-gray-900 text-sm rounded-lg px-3 py-2 h-full"
                  placeholder="Passkey"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center py-2 px-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 h-full"
                >
                  Decrypt
                </button>
              </div>
            </form>

            {decryptedConfession && (
              <div className="mt-8 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Congrats you managed to decrypt the message!
                </h3>
                <div>First decryption using AES:</div>
                <div className="text-gray-600">{decryptedWithAES}</div>
                <div className="mt-4">
                  Final decryption using caesar cipher (shift 3):
                </div>
                <p className="">{decryptedConfession}</p>
              </div>
            )}
          </div>
        ) : (
          <p>Loading confession...</p>
        )}
      </div>

      <div className="reenie-beanie-regular text-4xl border-t-[1px] border-gray-300 p-6 flex justify-end mt-4">
        <h1>confessit!</h1>
      </div>
    </div>
  );
}
