import { Input, Spin, Alert, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../features/movies/movieSlice";
import MovieGrid from "../components/MovieGrid";


const { Title } = Typography;
const {Search} = Input;


const MovieSearch = () => {
    const dispatch = useDispatch();
    const { movies, loading, error } = useSelector((state) => state.movies);

    const handleSearch = (value) => {
        if (value.trim()) {
            dispatch(fetchMovies(value));
        }
    };

    return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>🎬 Movie Search</Title>

      <Search
        placeholder="Search movies..."
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
        style={{ marginBottom: 24 }}
      />

      {loading && (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <Spin size="large" />
        </div>
      )}

      {error && (
        <Alert
          type="error"
          message="Error"
          description={error}
          style={{ marginBottom: 24 }}
        />
      )}

      {!loading && !error && <MovieGrid movies={movies} />}
    </div>
  );
};

export default MovieSearch;