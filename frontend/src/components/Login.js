import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <p>Don't have an account? <Link to="/register">Register here</Link></p> {/* Link to Register */}
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: 0,
    backgroundColor: '#f7f9fc',
    fontFamily: 'Arial, sans-serif',
  },
  formContainer: {
    border: '1px solid #ddd',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    width: '350px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    marginBottom: '8px',
    display: 'block',
    fontSize: '14px',
    color: '#555',
  },
  input: {
    width: '92%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#f9f9f9',
  },
  button: {
    padding: '13px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
};

export default Login;
