import "../styles/UserCard.css";

function UserCard(props) {
  return (
    <div className="user-card-container">
      <div className="user-card">
        <h2>{props.name}</h2>
        <p>Role: {props.role}</p>
        <p>
          Status: {props.isAvailable ? "Available 🟢" : "Not Available 🔴"}
        </p>
      </div>
    </div>
  );
}

export default UserCard;
