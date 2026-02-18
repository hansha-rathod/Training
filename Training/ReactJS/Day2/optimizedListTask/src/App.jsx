import './App.css';
import { useState, useCallback, useEffect } from "react";
import ListItem from './components/ListItem';

function App() {
  const [items, setItems] = useState([
    { id: 1, name: "Item A" },
    { id: 2, name: "Item B" },
    { id: 3, name: "Item C" },
    { id: 4, name: "Item D" }
  ]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {--
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div className="app-container">
      <h2 className="time-display">Current Time: {time.toLocaleTimeString()}</h2>

      <ul className="item-list">
        {items.length === 0 ? (
          <p className="empty-state">No items left. Add some items!</p>
        ) : (
          items.map(item => (
            <ListItem
              key={item.id}
              item={item}
              onDelete={handleDelete}
            />
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
