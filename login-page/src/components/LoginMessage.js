import React from 'react'

function LoginMessage({userName,userEmail}) {
  return (
    <div>
      <h2>Welcome, {userName}!</h2>
      <p>Your email is: {userEmail}</p>
    </div>  )
}

export default LoginMessage