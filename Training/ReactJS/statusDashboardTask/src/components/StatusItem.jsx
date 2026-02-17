import "./StatusItem.css"

function StatusItem({name, status}) {
  const statusClass = status === "Online" ? "status-online" : "status-offline"

  return (
    <div className="status-item">
      <h3>{name}</h3>
      <p className={statusClass}>Status: {status}</p>
    </div>
  )
}

export default StatusItem


