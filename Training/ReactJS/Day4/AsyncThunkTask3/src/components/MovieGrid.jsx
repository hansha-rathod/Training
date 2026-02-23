import { Row, Col, Card, Typography } from "antd";

const { Paragraph } = Typography;

const MovieGrid = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>No movies found</p>;
  }

  return (
    <Row gutter={[16, 16]}>
      {movies.map((item) => {
        const movie = item.show;
        return (
          <Col xs={24} sm={12} md={8} lg={6} key={movie.id}>
            <Card
              title={movie.name}
              cover={
                movie.image?.medium ? (
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      alt={movie.name}
                      src={movie.image.medium}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : null
              }
            >
              <Paragraph ellipsis={{ rows: 3 }}>
                {movie.summary ? movie.summary.replace(/<[^>]*>/g, '') : 'No description available'}
              </Paragraph>
              <div style={{ marginTop: '8px', color: '#666' }}>
                <strong>Rating:</strong> {movie.rating?.average || 'N/A'}
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default MovieGrid;