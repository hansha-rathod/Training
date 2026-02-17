import './App.css'
import StatusItem from './components/StatusItem'

function App() {

  const systems = [
    { id: 1, name: "Database", status: "Online" },
    { id: 2, name: "API Server", status: "Offline" },
    { id: 3, name: "Auth Service", status: "Online" }
  ];

  return (
    <div>
      <h1>Status Dashboard</h1>
      
      {systems.map(system => (
        <StatusItem
          key={system.id}
          name={system.name}
          status={system.status}
        />
      ))}

      </div>
  );
}

export default App