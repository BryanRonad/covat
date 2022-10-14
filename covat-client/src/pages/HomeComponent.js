import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
  useToast,
  Button,
  useDisclosure,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Modal,
  VStack,
  Text,
  Heading,
  HStack,
  Image,
  Center,
} from '@chakra-ui/react';
import {
  get,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
  push,
  ref,
  set,
} from 'firebase/database';
import NavbarComponent from '../components/NavbarComponent';
import { app, db } from '../config/firebaseConfig';
import { Icon } from '@chakra-ui/react';
import { CheckCircleIcon, NotAllowedIcon } from '@chakra-ui/icons';

function HomeComponent() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [modalInfo, setModalInfo] = useState({});
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token');
    if (authToken) {
      setAuth(true);
      const recordReadRef = ref(db, '/');
      return onValue(recordReadRef, snapshot => {
        const data = snapshot.val();
        setTableData(Object.values(data));
        console.log('Table data set');
      });
    } else {
      navigate('/');
      setAuth(false);
    }
  }, []);

  // useEffect(() => {
  //   let authToken = sessionStorage.getItem('Auth Token');
  //   if (authToken) {
  //     setAuth(true);
  //     const recordReadRef = ref(db, '/');
  //     let list = [];

  //     onChildAdded(recordReadRef, (snapshot) => {
  //       const data = snapshot.val();
  //       console.log(data);
  //       list.push(data);
  //       if (data.temperature > 37.8) {
  //         toast({
  //           title: 'High body temperature detected',
  //           description: `Student ${data.rno} logged with high temperature (${data.temperature})`,
  //           status: 'error',
  //           duration: 4000,
  //           isClosable: true,
  //           position: 'top-right',
  //         });
  //       }
  //       setTableData(tableData.concat(list));
  //     });
  //   } else {
  //     navigate('/');
  //     setAuth(false);
  //   }
  // }, []);

  // const randomFunction = () => {
  //   const recordReadRef = ref(db, '/');
  //   let list = [];
  //   onChildAdded(recordReadRef, snapshot => {
  //     const data = snapshot.val();
  //     list.push(data);
  //     setTableData(tableData.concat(data));
  //   });
  // };

  return (
    <>
      {auth != null &&
        (tableData.length > 0 ? (
          <div>
            <NavbarComponent resetButton={true} tableData={tableData} />
            <Box p="10">
              <Table variant="simple">
                {/* <TableCaption>Student attendance /</TableCaption> */}
                <Thead>
                  <Tr>
                    <Th>ROLL NO</Th>
                    <Th>NAME</Th>
                    <Th textAlign={'center'}>DEPARTMENT</Th>
                    <Th textAlign={'center'}>SEMESTER</Th>
                    <Th textAlign={'center'}>STATUS</Th>
                    <Th>DATETIME</Th>
                    <Th>INFO</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tableData.map((ele, index) => (
                    <Tr
                      key={index}
                      color={ele.status ? 'green.400' : 'red.400'}
                    >
                      <Td>{ele.rno}</Td>
                      <Td>{ele.name}</Td>
                      <Td textAlign={'center'}>{ele.department}</Td>
                      <Td textAlign={'center'}>{ele.semester}</Td>
                      <Td textAlign={'center'}>
                        {ele.status ? (
                          <Icon as={CheckCircleIcon}></Icon>
                        ) : (
                          <Icon as={NotAllowedIcon}></Icon>
                        )}
                      </Td>
                      <Td>{ele.datetime && new Date(ele.datetime).toLocaleTimeString()}</Td>
                      <Td color={'white'}>
                        <Button
                          onClick={e => {
                            onOpen();
                            setModalInfo(ele);
                          }}
                        >
                          View info
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                  <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>User Info</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <VStack>
                          <Box>
                            <HStack>
                              <Text>Name:</Text>
                              <Heading size="md">{modalInfo.name}</Heading>
                            </HStack>
                          </Box>
                          <Box>
                            <HStack>
                              <Text>Roll no.:</Text>
                              <Heading size="md">{modalInfo.rno}</Heading>
                            </HStack>
                          </Box>
                          <Box>
                            <Center>
                              {/* <Image
                                boxSize="max-content"
                                src={`data:image/png;base64,${btoa(
                                  modalInfo.img
                                )}`}
                              /> */}
                              <Box textAlign="center">
                                  <Image src={modalInfo.s3} alt='Dan Abramov' fallbackSrc='https://via.placeholder.com/150'/>
                              </Box>
                            </Center>
                          </Box>
                        </VStack>
                      </ModalBody>

                      <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                          Close
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Tbody>
              </Table>
            </Box>
          </div>
        ) : (
          <div>No data to show!</div>
        ))}
    </>
  );
}

export default HomeComponent;
