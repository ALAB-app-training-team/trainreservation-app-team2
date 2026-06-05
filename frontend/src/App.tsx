import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { SearchResult } from "./features/schedule/pages/SearchResult";
import { Header } from "./shared/components/Header";

function App() {
  return (
    <>
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 bg-white">
          <Header />
        </div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SearchResult />} />
            <Route path="/searchResult" element={<SearchResult />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
