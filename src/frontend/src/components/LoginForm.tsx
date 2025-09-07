import React from 'react';

const LoginForm = () => {
  return (
    <form>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
