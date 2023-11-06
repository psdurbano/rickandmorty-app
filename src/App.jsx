import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CharacterList from "./components/CharacterList";
import CharacterCard from "./components/CharacterCard";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<CharacterList />} />
          <Route path="/character/:id" element={<CharacterCard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
