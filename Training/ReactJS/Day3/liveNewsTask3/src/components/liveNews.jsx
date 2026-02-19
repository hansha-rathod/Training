import { useEffect, useState } from "react";
import "./liveNews.css";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Reusable fetch function
  const fetchPosts = async () => {
    setLoading(true); // show loading on refresh

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch on page load
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="live-news-container">
      <div className="live-news-header">
        <h1>📰 Live Posts</h1>
        <button className="refresh-button" onClick={fetchPosts}>
          🔄 Refresh Posts
        </button>
      </div>

      {/*  Loading UI */}
      {loading ? (
        <div className="loading-state">Loading posts...</div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <span className="post-id-badge">#{post.id}</span>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-body">{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Posts;
