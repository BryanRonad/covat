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
      const recordReadRef = ref(db, 'records');
      let list = [];
      onChildAdded(recordReadRef, snapshot => {
        const data = snapshot.val();
        list.push(data);
        if (data.temperature > 100.4) {
          toast({
            title: 'High body temperature detected',
            description: `Student ${data.rno} logged with high temperature (${data.temperature})`,
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: 'top-right',
          });
        }
        setTableData(tableData.concat(list));
      });
    } else {
      navigate('/');
      setAuth(false);
    }
  }, []);

  const randomFunction = () => {
    const recordReadRef = ref(db, 'records');
    let list = [];
    onChildAdded(recordReadRef, snapshot => {
      const data = snapshot.val();
      list.push(data);
      setTableData(tableData.concat(data));
    });
  };

  return (
    <>
      {auth != null && (
        <div>
          <NavbarComponent caller="home" />
          <Box p="10">
            <Table variant="simple">
              {/* <TableCaption>Student attendance records</TableCaption> */}
              <Thead>
                <Tr>
                  <Th>NAME</Th>
                  <Th>ROLL NO</Th>
                  <Th>DATETIME</Th>
                  <Th>DEPARTMENT</Th>
                  <Th>SEMESTER</Th>
                  <Th>TEMPERATURE</Th>
                  <Th>INFO</Th>
                </Tr>
              </Thead>
              {tableData.length > 0 && (
                <Tbody>
                  {tableData.map((ele, index) => (
                    <Tr
                      key={index}
                      color={ele.temperature > 100.4 && 'red.400'}
                    >
                      <Td>{ele.name}</Td>
                      <Td>{ele.rno}</Td>
                      <Td>{ele.datetime}</Td>
                      <Td>{ele.department}</Td>
                      <Td>{ele.semester}</Td>
                      <Td>{ele.temperature}</Td>
                      <Td>
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
                              <Image
                                boxSize="max-content"
                                src={`data:image/png;base64,${modalInfo.img}`}
                              />
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
              )}
            </Table>
          </Box>
        </div>
      )}
    </>
  );
}

export default HomeComponent;
