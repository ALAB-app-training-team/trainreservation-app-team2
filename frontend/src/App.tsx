import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { SearchResult } from "./features/schedule/pages/SearchResult/SearchResult";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchResult />} />
          <Route path="/searchResult" element={<SearchResult />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
