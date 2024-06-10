import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_SCHEDULES } from '../../graphql/queries';
import { Link } from 'react-router-dom';
import { ListGroup, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function AllSchedules() {
  const { loading, error, data } = useQuery(GET_SCHEDULES, {
    pollInterval: 500
  });

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" style={{ color: 'green' }}>
          <span className="visually-hidden">Loading schedules...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Error loading schedules: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="my-4 text-center" style={{ color: 'green' }}>All Schedules</h2>
          <ListGroup>
            {data.getSchedules.map(schedule => (
              <ListGroup.Item key={schedule._id} className="border border-success text-center">
                <Link to={`/schedule/${schedule._id}`} className="text-decoration-none" style={{ color: 'green' }}>
                  {schedule.title}
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default AllSchedules;

