import { useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import "./GlobalSearch.css";

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

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    loading: false,
    error: null
  });

  const navigate = useNavigate();


  useEffect(() => {
    if (!debouncedQuery) return;

    const fetchUsers = async () => {
      dispatch({ type: "FETCH_START" });

      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users?q=${debouncedQuery}`
        );

        if (!res.ok) throw new Error("API Failed");

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

    fetchUsers();

  }, [debouncedQuery]);

  return (
    <div className="container">
      <h1 className="title">User Directory</h1>

      {/*  Search Input */}
      <input
        className="search-input"
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/*  Loading */}
      {state.loading && <p className="loading">Loading...</p>}

      {/*  Error */}
      {state.error && (
        <div className="error">
          Error: {state.error}
        </div>
      )}

      {/*  Results */}
      <div className="users-list">
        {state.data.map(user => (
          <div
            key={user.id}
            className="user-card"
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GlobalSearch;
