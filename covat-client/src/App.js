import React, { useEffect } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginComponent from './pages/LoginComponent';
import RegisterComponent from './pages/RegisterComponent';
import HomeComponent from './pages/HomeComponent';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token');
    if (authToken) {
      navigate('/home');
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/home" element={<HomeComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
