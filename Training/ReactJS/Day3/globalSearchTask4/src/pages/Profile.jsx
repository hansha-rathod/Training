import { useParams, useNavigate } from "react-router-dom"
import { useReducer, useEffect } from "react"
import './Profile.css';

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

function Profile() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchUser = async () => {
      dispatch({ type: "FETCH_START" });

      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users/${profileId}`
        );

        if (!res.ok) throw new Error("User not found");

        const data = await res.json();

        dispatch({
          type: "FETCH_SUCCESS",
          payload: data
        });

      } catch (error) {
        dispatch({
          type: "FETCH_ERROR",
          payload: error.message
        });
      }
    };

    fetchUser();
  }, [profileId]);

  if (state.loading) {
    return (
      <div className="profile-container">
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="profile-container">
        <p style={{ color: "red" }}>Error: {state.error}</p>
        <button onClick={() => navigate("/")}>Back to Search</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <button onClick={() => navigate("/")} className="back-button">
        ← Back to Search
      </button>

      <h1>User Profile</h1>

      <div className="profile-card">
        <div className="profile-header">
          <h2>{state.data.name}</h2>
          <p>@{state.data.username}</p>
        </div>

        <div className="user-id-badge">
          User ID: {state.data.id}
        </div>

        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{state.data.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone</span>
            <span className="info-value">{state.data.phone}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Website</span>
            <span className="info-value">
              <a href={`http://${state.data.website}`} target="_blank" rel="noopener noreferrer">
                {state.data.website}
              </a>
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Company</span>
            <span className="info-value">{state.data.company.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Catchphrase</span>
            <span className="info-value">{state.data.company.catchPhrase}</span>
          </div>
        </div>

        <div className="address-section">
          <h3>Address</h3>
          <p>
            {state.data.address.street}, {state.data.address.suite}<br />
            {state.data.address.city}, {state.data.address.zipcode}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
