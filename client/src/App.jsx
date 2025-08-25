import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaySetupPage from "./pages/PlaySetupPage";
import CreateRoomPage from "./pages/CreateRoomPage";
import JoinRoomPage from "./pages/JoinRoomPage";
import MatchingPage from "./pages/MatchingPage";
import QuizPage from "./pages/QuizPage";
import CreateQuestionPage from "./pages/CreateQuestionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlaySetupPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/join" element={<JoinRoomPage />} />
        <Route path="/match" element={<MatchingPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/create-question" element={<CreateQuestionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
