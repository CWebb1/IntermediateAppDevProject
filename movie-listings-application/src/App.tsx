import { useState } from "react";
import MovieGrid from "./components/MovieGrid";
import { Navbar } from "./components/Navbar";
import "./App.css";
import { MovieCategory } from "./utiles/api";


function App() {
  const [activeCategory, setActiveCategory] = useState<MovieCategory>("trending");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />
      <main className="flex-grow p-6">
        <div className="mx-auto max-w-7xl">
          <MovieGrid category={activeCategory} />
        </div>
      </main>
      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        Data provided by The Movie DB
      </footer>
    </div>
  );
}

export default App;
