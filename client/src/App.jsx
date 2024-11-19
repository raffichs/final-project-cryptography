import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import MainPage from "./pages/MainPage";
import SubmitForm from "./pages/SubmitForm";
import DecryptForm from "./pages/DecryptPage";
import DecryptionPage from "./pages/DecryptionPage";
import SteganographyUploader from "./pages/Steganography";

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-3xl m-auto text-base">
        <Routes>
          <Route index element={<AuthForm />} />
          <Route path="/wall" element={<MainPage />}></Route>
          <Route path="/submit" element={<SubmitForm />}></Route>
          <Route path="/decrypt" element={<DecryptForm />}></Route>
          <Route path="/decryption/:id" element={<DecryptionPage />}></Route>
          <Route
            path="/steganography"
            element={<SteganographyUploader />}
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
