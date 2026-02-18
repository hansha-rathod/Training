
import './App.css'
import { useState, useMemo } from "react";

const bigList = Array.from(
  { length: 50000 },  // Creates an array of 5000 undefined elements
  (value, index) => {
    return `Item ${index + 1}`;
  } // Maps each element to a string -> "Item 1", "Item 2", ..., "Item 5000"

);



function App() {

  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  const filteredList = useMemo(() => {

    console.log("Filtering...");

    return bigList.filter(item =>
      item.toLowerCase().includes(search.toLowerCase().trim().replace(/\s+/g, " "))
    );
  }, [search]);


  return (
    <div className={dark ? "dark" : "light"}>
      <h1>Heavy Lifter Task</h1>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={() => setDark(prevDark => !prevDark)}>
        Toggle Theme
      </button>

      <p>Showing {filteredList.length} of {bigList.length} items</p>

      <ul>
        {filteredList.slice(0, 20).map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
