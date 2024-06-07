import React from 'react';
import { Container } from 'react-bootstrap';


function Header() {
  return (
    <header className="bg-success text-white py-4">
      <Container>
        <h1 className="text-center">ScheduleWizard</h1>
      </Container>
    </header>
  );
}

export default Header;

