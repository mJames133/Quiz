import { Box, Center, Flex, Text, Button, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { realdatabase } from "../firebase";
import Score from "./Score";

const Quiz = () => {
  const [questions, setQuestions] = useState(null);
  const [currentQuest, setCurrentQuest] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const params = useParams();

  const currentPage = params.quizId - 1;

  useEffect(() => {
    realdatabase.ref("/list").on("value", (querySnapshot) => {
      const data = querySnapshot.val() || null;
      if (data) {
        const tempData = Object.values(data);
        setQuestions(tempData[currentPage]);
      }
    });
  }, []);

  const answerHandler = (correctAnswer) => {
    if (correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuest + 1 < questions.questions.length) {
      setCurrentQuest(currentQuest + 1);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div>
      {questions !== null && (
        <Center py={9} flexDirection="column">
          <Text textAlign="center" fontSize="25" fontWeight={"bold"} py={4}>
            {showScore
              ? "Quiz Results"
              : `Question ${currentQuest + 1} of ${questions.questions.length}`}
          </Text>

          {!showScore && (
            <Box
              maxW={"500px"}
              w={"full"}
              bg="blue.500"
              pb={8}
              boxShadow={"2xl"}
              overflow={"hidden"}
              rounded={"md"}
            >
              <Box bg="gray.800">
                <Text
                  color="white"
                  textAlign="center"
                  textTransform="uppercase"
                  fontSize="20"
                  py={3}
                >
                  {questions.questions[currentQuest].question}
                </Text>
              </Box>
              <VStack spacing={4} pt={8}>
                {questions.questions[currentQuest].answers.map((data) => (
                  <Button
                    key={data.name}
                    borderRadius={15}
                    height={45}
                    value={data.isCorrect}
                    onClick={(e) => answerHandler(data.isCorrect)}
                  >
                    <Flex align="center" p={4} w="400px" align="center">
                      <Text fontSize={28} px={2} fontWeight="bold">
                        {data.id}
                      </Text>
                      <Text pl={4} fontSize={20}>
                        {data.name}
                      </Text>
                    </Flex>
                  </Button>
                ))}
              </VStack>
            </Box>
          )}
          {showScore && (
            <Score score={score} total={questions.questions.length} />
          )}
        </Center>
      )}
    </div>
  );
};

export default Quiz;
