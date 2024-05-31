import { useState } from 'react';
//import { Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations';

import Auth from '../auth/auth';

const Login = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [login, { error, data }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    //console.log(formState);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await login({
        variables: { ...userFormData },
      })

      Auth.login(data.login.token);
    } catch (error) {
      console.error(error);
      setShowAlert(true);
    }

    // clear form values
    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='warning'>
          Something went wrong with your login!
        </Alert>

        <Form.Group className='mb-3' controlId="exampleForm.ControlInput1">
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control type='text' placeholder='Your email' name='email' onChange={handleInputChange} value={userFormData.email} required/>
          <Form.Control.Feedback type='invalid'>An email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3' controlId="exampleForm.ControlInput2">
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control type='password' placeholder='Your password' name='password' onChange={handleInputChange} value={userFormData.password} required/>
          <Form.Control.Feedback type='invalid'>A password is required!</Form.Control.Feedback>
        </Form.Group>

        <Button
          disabled={!(userFormData.email && userFormData.password)} type='submit' variant='info'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default Login;