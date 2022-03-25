import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link as CLink,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  getAuth,
  signInWithEmailAndPassword,
  //   createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';

export default function LoginComponent() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();
  const globalColor1 = useColorModeValue('gray.50', 'gray.800');
  const globalColor2 = useColorModeValue('white', 'gray.700');
  const toast = useToast();

  const handleAction = () => {
    const authentication = getAuth();
    signInWithEmailAndPassword(authentication, email, password)
      .then(response => {
        console.log(response);
        sessionStorage.setItem(
          'Auth Token',
          response._tokenResponse.refreshToken
        );
        sessionStorage.setItem('email', response.user.email);
        navigate('/home');
      })
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          toast({
            title: 'Incorrect password',
            description: 'Please enter the correct password',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
        }
        if (error.code === 'auth/user-not-found') {
          toast({
            title: 'Email does not exist',
            description: 'Please enter an email which exists',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
        }
      });
  };

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token');
    if (authToken) {
      setAuth(true);
      navigate('/home');
    } else {
      setAuth(false);
    }
  }, []);

  return (
    <>
      <NavbarComponent />
      {auth != null && (
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={globalColor1}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'}>Sign in to your account</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                to enjoy our cool <CLink color={'blue.400'}>features</CLink> ✌️
              </Text>
            </Stack>
            <Box rounded={'lg'} bg={globalColor2} boxShadow={'lg'} p={8}>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}
                  >
                    <Checkbox>Remember me</Checkbox>
                    <CLink color={'blue.400'}>
                      <Link to="/register"> Not a user? </Link>
                    </CLink>
                  </Stack>
                  <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                    onClick={handleAction}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      )}
    </>
  );
}
