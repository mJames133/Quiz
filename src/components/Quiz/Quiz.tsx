import {
  Box,
  Center,
  Flex,
  Text,
  Button,
  VStack,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { realdatabase, db } from "../firebase";
import { useAuth } from "../../stores/auth-context";
import Score from "./Score";

type AnswersType = {
  id: string;
  isCorrect: boolean;
  name: string;
};

type QuestionType = {
  question: string;
  answers: AnswersType[];
};

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuest, setCurrentQuest] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizNameKey, setQuizNameKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAns, setSelectedAns] = useState([]);
  const [score, setScore] = useState(0);
  const { quizId }: any = useParams();
  const { currentUser } = useAuth();

  const currentPage = quizId - 1;

  useEffect(() => {
    if (!isLoading) {
      const ref = realdatabase.ref("/list");
      const listener = ref.on("value", (querySnapshot) => {
        const data = querySnapshot.val() || null;
        if (data) {
          const tempData: any = Object.values(data);
          setQuestions(tempData[currentPage].questions);
          setQuizNameKey(Object.getOwnPropertyNames(data)[currentPage]);
        }
      });
      return () => ref.off('value', listener);
    }
  }, []);

  const updateAnswer = (row: number) => {
    let correctAnswers: any = [...selectedAns];
    correctAnswers[currentQuest] = row;
    setSelectedAns(correctAnswers);
  };

  const prevQuestionHandler = () => {
    if (currentQuest + 1 > 1) {
      setCurrentQuest(currentQuest - 1);
    }
  };

  const nextQuestionHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    if (currentQuest + 1 < questions.length) {
      setCurrentQuest(currentQuest + 1);
    } else {
      let tempScore = 0;
      questions.map((el: any, row) => {
        el.answers.map((element: any, index: number) => {
          if (element.isCorrect) {
            if (index == selectedAns[row]) {
              tempScore++;
            }
          }
        });
      });
      setScore(tempScore);
      setShowScore(true);

      db.collection("users")
        .doc(currentUser.uid)
        .get()
        .then((snapshot: any) => {
          const data = snapshot.data().userInfo;

          realdatabase
            .ref()
            .child("/list/")
            .child(quizNameKey)
            .child("users")
            .child(currentUser.uid)
            .set({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              score: tempScore,
            });
        });
    }
    setIsLoading(false);
  };

  return (
    <Box>
      {questions.length !== 0 && (
        <Center py={9} flexDirection="column">
          <Text textAlign="center" fontSize="25" fontWeight={"bold"} py={4}>
            {showScore
              ? "Quiz Results"
              : `Question ${currentQuest + 1} of ${questions.length}`}
          </Text>
          {!showScore && (
            <Box
              maxW={{ base: "xs", md: "500px" }}
              w="full"
              bg="blue.500"
              pb={8}
              boxShadow={"2xl"}
              overflow={"hidden"}
              rounded={"md"}
            >
              <form onSubmit={nextQuestionHandler}>
                <Box bg="gray.800">
                  <Text
                    color="white"
                    textAlign="center"
                    textTransform="uppercase"
                    fontSize="20"
                    py={3}
                    px={10}
                  >
                    {questions[currentQuest].question}
                  </Text>
                </Box>
                <VStack spacing={2} pt={8}>
                  <RadioGroup
                    name={"choice"}
                    value={`${selectedAns[currentQuest]}`}
                  >
                    {questions[currentQuest].answers.map((data, row) => (
                      <Flex
                        key={row}
                        borderRadius={15}
                        bgColor="white"
                        my={4}
                        py={1}
                        px={2}
                        align="center"
                        w={{ base: "200px", md: "400px" }}
                        onClick={() => updateAnswer(row)}
                      >
                        <Radio size="lg" isRequired value={`${row}`} />
                        <Text fontSize={28} px={3} maxW={30} fontWeight="bold">
                          {data.id}
                        </Text>
                        <Text pl={4} fontSize={20}>
                          {data.name}
                        </Text>
                      </Flex>
                    ))}
                  </RadioGroup>
                </VStack>
                <Flex justifyContent="space-around">
                  <Button onClick={prevQuestionHandler}>
                    Previous question
                  </Button>
                  <Button type="submit">
                    {questions.length - 1 == currentQuest
                      ? "Submit quiz"
                      : "Next question"}
                  </Button>
                </Flex>
              </form>
            </Box>
          )}
          {showScore && <Score score={score} total={questions.length} />}
        </Center>
      )}
    </Box>
  );
};

export default Quiz;
