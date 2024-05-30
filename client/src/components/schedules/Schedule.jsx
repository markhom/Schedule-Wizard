import React, { useState } from 'react';
import HourEntry from './HourEntry';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Schedule({ schedules, onUpdateSchedule }) {
    return (
        <Container>
            <h1 className="mb-4">24 Hour Schedules</h1>
            {schedules.map(schedule => (
                <div key={schedule.id}>
                    <h2>{schedule.title}</h2>
                    <Row xs={1} md={2} lg={3}>
                        {schedule.blocks.map((block, index) => (
                            <Col key={index}>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <HourEntry
                                            startHour={block.startHour}
                                            endHour={block.endHour}
                                            activity={block.activity}
                                            updateActivity={(newActivity) => onUpdateSchedule(schedule.id, index, newActivity)}
                                        />
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </Container>
    );
}

export default Schedule;
