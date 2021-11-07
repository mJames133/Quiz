import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Container,
  Button,
  useToast,
  Box,
} from "@chakra-ui/react";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import { useAuth } from "../stores/auth-context";

interface RoleType {
  isAdmin: Boolean;
  isMod: boolean;
}

interface UsersType {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
  roles: RoleType[];
}

const Users = () => {
  const { currentUser } = useAuth();
  const [effectedUsers, setEffectedUsers] = useState([]);
  const [users, setUsers] = useState<UsersType[]>([]);
  const toast = useToast();

  useEffect(() => {
    db.collection("users")
      .get()
      .then(function (snapshot) {
        let usersInfo = [...users];
        
        snapshot.forEach(function (doc) {
          const data = doc.data().userInfo;
          usersInfo.push(data);
        });
        
        setUsers(usersInfo);
      });
  }, []);

  const selectRoleValue = (role: RoleType) => {
    return role.isAdmin ? "admin" : role.isMod ? "mod" : "user";
  };

  const selectInputHandler = (
    event: React.ChangeEvent<HTMLSelectElement>,
    row: number
  ) => {
    let userData: any = [...users];
    let effected: any = [...effectedUsers];

    const newValue = event.target.value;
    if (newValue === "mod") {
      userData[row].roles[0].isAdmin = false;
      userData[row].roles[0].isMod = true;
    }
    if (newValue === "admin") {
      userData[row].roles[0].isAdmin = true;
      userData[row].roles[0].isMod = false;
    }
    if (newValue === "user") {
      userData[row].roles[0].isAdmin = false;
      userData[row].roles[0].isMod = false;
    }
    effected.push(row);
    setEffectedUsers(effected);
    setUsers(userData);
      
  };

  const submitHandler = () => {
    let usersData: any = [];
    effectedUsers.map((el) => {
      usersData.push(users[el]);
    });
    
    usersData.map((el: any) => {
      const userRef = db.collection("users").doc(el.uid);
      userRef.set({
        userInfo: usersData[0],
      });
    });
    toast({
      position: "bottom-left",
      title: "Users",
      description: `Users succesfully updated`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container>
      <Box overflowX={{ base: "auto", md: "hidden" }}>
        <Table variant="simple" w="md">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users !== null &&
              users.map((quiz, row) => (
                <Tr key={row}>
                  <Td>{`${quiz.firstName + " " + quiz.lastName}`}</Td>
                  <Td>{`${quiz.email}`}</Td>

                  <Td w="full">
                    <Select
                      disabled={quiz.uid === currentUser.uid}
                      width={170}
                      onChange={(e) => selectInputHandler(e, row)}
                      defaultValue={selectRoleValue(quiz.roles[0])}
                    >
                      <option value="admin">Administrator</option>
                      <option value="mod">Moderator</option>
                      <option value="user">User</option>
                    </Select>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
      <Box align="right">
        <Button onClick={submitHandler} mt={4}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default Users;
