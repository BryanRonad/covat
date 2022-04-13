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
  const toast = useToast();

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
                </Tr>
              </Thead>
              {tableData.length > 0 && (
                <Tbody>
                  {tableData.map((ele, index) => (
                    <Tr key={index}>
                      <Td>{ele.name}</Td>
                      <Td>{ele.rno}</Td>
                      <Td>{ele.datetime}</Td>
                      <Td>{ele.department}</Td>
                      <Td>{ele.semester}</Td>
                      <Td>{ele.temperature}</Td>
                    </Tr>
                  ))}
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
