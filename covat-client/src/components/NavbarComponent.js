import {
  Box,
  Flex,
  Avatar,
  //   Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  //   useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Heading,
  MenuDivider,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  //   const { isOpen, onOpen, onClose } = useDisclosure();
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('Auth Token');
    navigate('/');
  };

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token');
    console.log('Render');
    if (authToken) {
      setAuth(true);
      setEmail(sessionStorage.getItem('email'));
    } else {
      setAuth(false);
    }
  }, []);

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <Heading fontSize={'xl'}>
              <Link to="/">COVAT</Link>
            </Heading>
          </Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              {email && (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                  >
                    <Avatar
                      size={'sm'}
                      src={'https://img.icons8.com/office/344/test-account.png'}
                    />
                  </MenuButton>
                  <MenuList alignItems={'center'}>
                    <br />
                    <Center>
                      <Avatar
                        size={'2xl'}
                        src={
                          'https://img.icons8.com/office/344/test-account.png'
                        }
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>{email ? email : undefined}</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
