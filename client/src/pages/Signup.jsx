import { useState } from 'react';
//import { Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../graphql/mutations';

import Auth from '../auth/auth';

const Signup = () => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '', });
  const [validated] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [addUser, { error, data }] = useMutation(ADD_USER);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    //console.log(formState);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      console.log(data);
      Auth.login(data.addUser.token);
    } catch (error) {
      console.error(error);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='warning'>
          Something went wrong with your signup!
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control type='text' placeholder='Your username' name='username' onChange={handleInputChange} value={userFormData.username} required />
          <Form.Control.Feedback type='invalid'>A username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control type='email' placeholder='Your email address' name='email' onChange={handleInputChange} value={userFormData.email} required />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control type='password' placeholder='Your password' name='password' id='password' aria-describedby="passwordHelp" onChange={handleInputChange} value={userFormData.password} required />
          <Form.Text id="passwordHelp" muted>
            Your password must be 8-20 characters long, contain letters and numbers,
            and must not contain spaces, special characters, or emoji.
          </Form.Text>
          <Form.Control.Feedback type='invalid'>A password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)} type='submit' variant='info'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default Signup;

// <main className="flex-row justify-center mb-4">
//   <div className="col-12 col-lg-10">
//     <div className="card">
//       <h4 className="card-header bg-dark text-light p-2">Sign Up</h4>
//       <div className="card-body">
//         {data ? (
//           <p>
//             Success! You may now head{' '}
//             <Link to="/">back to the homepage.</Link>
//           </p>
//         ) : (
//           <form onSubmit={handleFormSubmit}>
//             <input
//               className="form-input"
//               placeholder="Your username"
//               name="username"
//               type="text"
//               value={formState.name}
//               onChange={handleChange}
//             />
//             <input
//               className="form-input"
//               placeholder="Your email"
//               name="email"
//               type="email"
//               value={formState.email}
//               onChange={handleChange}
//             />
//             <input
//               className="form-input"
//               placeholder="******"
//               name="password"
//               type="password"
//               value={formState.password}
//               onChange={handleChange}
//             />
//             <button
//               className="btn btn-block btn-primary"
//               style={{ cursor: 'pointer' }}
//               type="submit"
//             >
//               Submit
//             </button>
//           </form>
//         )}

//         {error && (
//           <div className="my-3 p-3 bg-danger text-white">
//             {error.message}
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// </main>