import "./App.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SybilandIntro from "./pages/SybilandIntro";
import MintPage from "./pages/MintPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import desert_sound from "./assets/desert-air-sound.mp3";

const App: FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SybilandIntro />} />
          <Route path="mint" element={<MintPage />} />
          {/* <Route index element={<Home />} /> */}
          {/* <Route path="*" element={<NoPage />} /> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer className="z-2" position="bottom-right" hideProgressBar />
    </>
  );
};
export default App;
