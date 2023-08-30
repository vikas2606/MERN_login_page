// src/components/LoginForm.js
import React, { useState,useEffect } from 'react';
import LoginMessage from './LoginMessage';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [showMessage, setShowMessage] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, password }),
            });
            const data = await response.json();
            setToken(data.token);
            setShowMessage(true);
            console.log(data)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (token) {
          // Fetch user info using the token
          fetch('http://localhost:5000/user-info', {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
          })
            .then((response) => response.json())
            .then((data) => setUserInfo(data))
            .catch((error) => console.error('Error:', error));
        }
      }, [token]);

    return (
        <div>
          {userInfo ? (<LoginMessage userName={userInfo.name} userEmail={userInfo.email}/>):(
            <div><h2>Login or Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form></div>)}
        </div>
    );
}

export default LoginForm;
