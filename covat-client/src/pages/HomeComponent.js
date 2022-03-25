import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';

function HomeComponent() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token');

    if (authToken) {
      navigate('/home');
      setAuth(true);
    } else {
      navigate('/');
      setAuth(false);
    }
  }, []);
  return (
    <>
      {auth != null && (
        <div>
          <NavbarComponent />
          HomeComponent
        </div>
      )}
    </>
  );
}

export default HomeComponent;
