import {
  HStack,
  VStack,
  Text,
  Button,
  Heading,
  useToast,
  Box,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { realdatabase } from "./firebase";
import { useAuth } from "../stores/auth-context";
import {
  EditIcon,
  DeleteIcon,
  InfoOutlineIcon,
  ArrowDownIcon,
} from "@chakra-ui/icons";
import { useStore } from "../stores/quiz-context";

type QuizData = {
  firstName: string;
  lastName: string;
  score: number;
};

const Main = () => {
  const { changeEditQuiz } = useStore();
  const [quizs, setQuizs] = useState<Array<any>>([]);
  const [quizID, setQuizID] = useState<Array<string>>([]);
  const [openInfo, setOpenInfo] = useState(false);
  const [popInfo, setPopInfo] = useState<Array<QuizData>>([]);
  const { currentUser, roles } = useAuth();
  const history = useHistory();
  const toast = useToast();

  const renderData = () => {
    const ref = realdatabase.ref("/list");
    ref.on("value", (querySnapshot) => {
      const data = querySnapshot.val() || null;
      if (data) {
        setQuizs(Object.values(data));
        setQuizID(Object.getOwnPropertyNames(data));
      } else {
        setQuizs([]);
      }
    });
  };

  useEffect(() => {
    renderData();
  }, [realdatabase]);

  const playQuizHandler = (row: number) => {
    if (!currentUser) {
      toast({
        position: "bottom-left",
        title: "Error",
        description: "You should be logged in to play quiz!",
        status: "error",
        duration: 2000,
        isClosable: false,
      });
      return;
    }
    history.replace(`/Quiz/quiz/${row + 1}`);
  };

  const removeQuizHandler = (quiz: number) => {
    realdatabase.ref("/list").child(quizID[quiz]).remove();
    renderData();
  };

  const editQuizHandler = (quiz: number) => {
    changeEditQuiz(true);
    history.replace(`/Quiz/edit-quiz/${quiz + 1}`);
  };

  const handleOpenInfo = (quiz: number) => {
    setOpenInfo((prevState) => !prevState);
    if (!openInfo) {
      realdatabase.ref("/list/" + quizID[quiz]).on("value", (snapshot) => {
        const data = snapshot.val();
        if (data && data.users) {
          const usersData = Object.entries(data.users);
          let tempUser: any = [];
          usersData.map((el) => {
            tempUser.push(el[1]);
          });
          setPopInfo(tempUser);
        }
      });
    }
  };
  const SelectIconGroup: React.FC<{ row: number }> = ({ row }) => {
    return (
      <Box>
        <IconButton
          mr={2}
          aria-label="Info"
          colorScheme="gray"
          icon={<InfoOutlineIcon />}
          onClick={() => handleOpenInfo(row)}
        />
        <IconButton
          mr={2}
          aria-label="Edit Quiz"
          colorScheme="gray"
          icon={<EditIcon />}
          onClick={() => editQuizHandler(row)}
        />
        <IconButton
          mr={2}
          aria-label="Remove Quiz"
          colorScheme="gray"
          icon={<DeleteIcon />}
          onClick={() => removeQuizHandler(row)}
        />
      </Box>
    );
  };

  return (
    <Box>
      <Box>
        <Modal isOpen={openInfo} onClose={() => setOpenInfo(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Quiz Stats</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {popInfo.length === 0 && (
                <Text align="center">No stats found!</Text>
              )}
              {popInfo.length !== 0 && (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Score</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {popInfo.map((quiz: QuizData, row: number) => (
                      <Tr key={row}>
                        <Td>{`${quiz.firstName + " " + quiz.lastName}`}</Td>
                        <Td>{`${quiz.score}`}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
      <VStack pt={6} spacing={4}>
        <Heading pb={3}>Quizs</Heading>
        {quizs !== null &&
          quizs.map((quiz, row: number) => (
            <HStack
              key={row}
              display="flex"
              borderRadius={30}
              borderWidth={1}
              bg="gray.300"
              py={2}
            >
              <Box p={4} h="70px" display="flex" alignItems="center">
                <Text fontSize={20} mr={4}>
                  {quiz.name}
                </Text>
                <Box display="flex" alignItems="center">
                  {(roles[0].isAdmin || roles[0].isMod) && (
                    <Box>
                      <Box display={{ base: "flex", md: "none" }}>
                        <Popover>
                          <PopoverContent w="160px">
                            <PopoverArrow />
                            <PopoverBody justifyContent="center" display="flex">
                              <SelectIconGroup row={row} />
                            </PopoverBody>
                          </PopoverContent>
                          <PopoverTrigger>
                            <IconButton
                              mr={2}
                              aria-label="options"
                              colorScheme="gray"
                              icon={<ArrowDownIcon />}
                            />
                          </PopoverTrigger>
                        </Popover>
                      </Box>
                      <Box display={{ base: "none", md: "flex" }}>
                        <SelectIconGroup row={row} />
                      </Box>
                    </Box>
                  )}
                  <Button
                    mr={2}
                    size="xs"
                    height="48px"
                    width="80px"
                    borderRadius={15}
                    bg="gray.800"
                    color="white"
                    _hover={{ bg: "gray.700" }}
                    onClick={() => playQuizHandler(row)}
                  >
                    Play
                  </Button>
                </Box>
              </Box>
            </HStack>
          ))}
        )
      </VStack>
    </Box>
  );
};
export default Main;
