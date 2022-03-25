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
} from '@chakra-ui/react';
import { onValue, push, ref, set } from 'firebase/database';
import NavbarComponent from '../components/NavbarComponent';
import { app, db } from '../config/firebaseConfig';

function HomeComponent() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [tableData, setTableData] = useState([]);

  function writeUserData() {
    const recordToPush = {
      email: 'test@test.com',
      rno: 5019107,
      datetime: new Date().toLocaleString(),
      department: 'IT',
      temperature: 98.5,
    };
    set(push(ref(db, 'records')), recordToPush);
  }

  function readUserData() {
    const recordReadRef = ref(db, 'records');
    onValue(recordReadRef, snapshot => {
      const data = snapshot.val();
      if (Object.keys(data) > 0) {
        let arrayOfObj = null;
        arrayOfObj = Object.entries(data).map(e => ({ [e[0]]: e[1] }));
        setTableData(arrayOfObj);
        console.log(arrayOfObj);
      } else {
        setTableData([]);
      }
    });
  }

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token');
    if (authToken) {
      setAuth(true);
      // writeUserData();
      const recordReadRef = ref(db, 'records');
      onValue(recordReadRef, snapshot => {
        const data = snapshot.val();
        if (Object.keys(data).length > 0) {
          let arrayOfObj = Object.entries(data).map(e => ({ [e[0]]: e[1] }));
          setTableData(arrayOfObj);
        } else {
          setTableData([]);
        }
      });
    } else {
      navigate('/');
      setAuth(false);
    }
  }, []);
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
                  <Th>EMAIL</Th>
                  <Th>ROLL NO</Th>
                  <Th>DATETIME</Th>
                  <Th>DEPARTMENT</Th>
                  <Th>TEMPERATURE</Th>
                </Tr>
              </Thead>
              {tableData.length > 0 && (
                <Tbody>
                  {console.log(tableData[0][Object.keys(tableData[0])])}
                  {tableData.map((ele, index) => (
                    <Tr key={index}>
                      <Td>{ele[Object.keys(ele)].email}</Td>
                      <Td>{ele[Object.keys(ele)].rno}</Td>
                      <Td>{ele[Object.keys(ele)].datetime}</Td>
                      <Td>{ele[Object.keys(ele)].department}</Td>
                      <Td>{ele[Object.keys(ele)].temperature}</Td>
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
