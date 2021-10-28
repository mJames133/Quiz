import { HStack, VStack, Text, Flex, Button, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { realdatabase } from "./firebase";

const Main = () => {
  const [quizs, setQuizs] = useState(null);
  useEffect(() => {
    realdatabase.ref("/list").on("value", (querySnapshot) => {
      const data = querySnapshot.val() || null;
      if (data) {
        setQuizs(Object.values(data));
      }
    });
  }, []);

  return (
    <VStack pt={6} spacing={4}>
      <Heading pb={3}>Quizs</Heading>
      {quizs !== null &&
        quizs.map((quiz, row) => (
          <HStack
            key={quiz.name}
            display="flex"
            justifyContent="space-between"
            borderRadius={30}
            borderWidth={1}
            bg="gray.300"
          >
            <Flex
              p={4}
              w="400px"
              h="70px"
              justifyContent="space-between"
              align="center"
            >
              <Text fontSize={20}>{quiz.name}</Text>
              <Link to={`/quiz/${row + 1}`}>
                <Button
                  size="md"
                  height="48px"
                  width="100px"
                  borderRadius={15}
                  bg="gray.800"
                  color="white"
                  _hover={{ bg: "gray.700" }}
                >
                  Play
                </Button>
              </Link>
            </Flex>
          </HStack>
        ))}
      )
    </VStack>
  );
};
export default Main;
