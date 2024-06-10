import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SearchResultsPage() {
  const location = useLocation();
  const { users = [], schedules = [] } = location.state || {};

  return (
    <Container>
      <h1>Search Results</h1>
      <Row>
        <Col>
          <h2>Users</h2>
          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            users.map((user) => (
              <Card key={user._id} className="mb-3">
                <Card.Body>
                  <Card.Title>
                    <Link to={`/profile/${user.username}`}>{user.username}</Link>
                  </Card.Title>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
        <Col>
          <h2>Schedules</h2>
          {schedules.length === 0 ? (
            <p>No schedules found</p>
          ) : (
            schedules.map((schedule) => (
              <Card key={schedule._id} className="mb-3">
                <Card.Body>
                  <Card.Title>
                    <Link to={`/schedule/${schedule._id}`}>{schedule.title}</Link>
                  </Card.Title>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchResultsPage;
