import {
  Center,
  FormControl,
  Input,
  Heading,
  FormLabel,
  Box,
  Button,
  RadioGroup,
  Radio,
  useToast,
  Flex,
  Divider,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { realdatabase } from "../firebase";
import { useStore } from "../../stores/quiz-context";

const CreateQuiz = () => {
  const { editQuiz } = useStore();
  const toast = useToast();
  const { IdQuiz }: any = useParams()   
  const history = useHistory();
  const [name, setName] = useState("");
  const [newChoices, setNewChoices] = useState([4]);
  const [choices, setChoices] = useState([[]]);
  const [correctAns, setCorrectAns] = useState([null]);
  const [formValues, setFormValues] = useState([[]]);

  type ChoiceTypes = {
    name: string[];
    isCorrect: boolean;
    id: string;
  };

  type DataTypes = {
    question: string[];
    answers: any[];
  };

  useEffect(() => {
    if (editQuiz) {
      const ref = realdatabase.ref("/list");
      ref.on("value", (querySnapshot) => {
        const data: any = querySnapshot.val() || null;
        if (data) {
          const tempData: any = Object.values(data)[IdQuiz - 1];

          let forms: any = [];
          let choicess: any = [];
          let newChoicess: any = [];
          let newCorrect: any = [];
          tempData.questions.forEach((el: DataTypes, i: number) => {
            let choicesName: string[][] = [];
            forms.push(el.question);
            let elAns = el.answers;
            elAns.forEach((ansEl: ChoiceTypes, j: number) => {
              choicesName.push(ansEl.name);
              if (ansEl.isCorrect) {
                newCorrect[i] = j;
              }
            });
            choicess.push(choicesName);
            newChoicess.push(el.answers.length);
          });
          setName(tempData.name);
          setNewChoices(newChoicess);
          setFormValues(forms);
          setChoices(choicess);
          setCorrectAns(newCorrect);
        }
      });
    }
  }, []);

  const changeQuestionHandler = (
    i: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newFormValues: any[] = [...formValues];
    newFormValues[i] = e.target.value;
    setFormValues(newFormValues);
  };

  const updateChoices = (
    index: number,
    row: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newArr: any[] = [...choices];
    newArr[index][row] = e.target.value;
    setChoices(newArr);
  };
  const addFormFields = () => {
    setFormValues([...formValues, []]);
    setChoices([...choices, []]);
    setNewChoices([...newChoices, 4]);
    setCorrectAns([...correctAns, null]);
  };

  const removeFormFields = (i: number) => {
    let newFormValues = [...formValues];
    let choiceValues = [...choices];

    newFormValues.splice(i, 1);
    choiceValues.splice(i, 1);

    setFormValues(newFormValues);
    setChoices(choiceValues);
    setNewChoices((prevState) => prevState.slice(0, -1));
    setCorrectAns((prevState) => prevState.slice(0, -1));
  };

  const QuestionList = () => {
    let questionList = [];
    for (let i = 0; i < formValues.length; i++) {
      let answers = [];
      for (let j = 0; j < newChoices[i]; j++) {
        answers.push({
          id: String.fromCharCode(97 + j).toUpperCase(),
          name: choices[i][j],
          isCorrect: correctAns[i] == j ? true : false,
        });
      }

      questionList.push({
        question: formValues[i],
        answers,
      });
    }
    return questionList;
  };

  const handleAddChoices = (row: number) => {
    if (newChoices[row] < 5) {
      let tempChoices = [...newChoices];
      tempChoices[row]++;
      setNewChoices(tempChoices);
    }
  };
  const handleRemoveChoices = (row: number) => {
    if (newChoices[row] > 2) {
      let tempChoices = [...newChoices];
      tempChoices[row]--;
      setNewChoices(tempChoices);
    }
  };

  const updateCorrectAns = (
    i: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let correctAnswers: any = [...correctAns];
    correctAnswers[i] = e.target.value;
    setCorrectAns(correctAnswers);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    QuestionList();

    const ref = realdatabase.ref("/list");
    if (editQuiz) {
      ref.once("value", (snapshot) => {
        const data = snapshot.val();
        const dataName = Object.getOwnPropertyNames(data)[IdQuiz - 1];
        ref.child(dataName).update({
          name,
          questions: QuestionList(),
        });
      });
    } else {
      ref.push({
        name,
        questions: QuestionList(),
      });
    }
    toast({
      position: "bottom-left",
      title: "Quiz",
      description: `Quiz was succesfully ${editQuiz ? "edited" : "created"}`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    history.replace("/Quiz/");
  };

  return (
    <Center align="center" py={9} flexDirection="column">
      <Heading>{editQuiz ? "Edit Quiz" : "Create Quiz"}</Heading>
      <Box width={{ base: "xs", md: "4xl" }}>
        <FormControl align="left">
          <form onSubmit={handleSubmit}>
            <FormLabel htmlFor="name" id="name">
              Quiz Name
            </FormLabel>
            <Box>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                type="text"
                placeholder="Enter quiz name"
                mb={10}
                width={{ base: 200, md: 300 }}
              />
              <Heading align="center" fontSize="3xl" fontWeight="bold">
                Questions
              </Heading>
            </Box>
            {formValues.map((element, index) => (
              <Box className="form-inline" key={index} align="left">
                <Box>
                  <Box mb={10}>
                    <FormLabel>Question</FormLabel>
                    <Input
                      required
                      type="text"
                      name="question"
                      width={{ base: 200, md: 300 }}
                      value={element || ""}
                      onChange={(e) => changeQuestionHandler(index, e)}
                    />
                  </Box>
                  <RadioGroup
                    name={`choice${index}`}
                    value={`${correctAns[index]}`}
                  >
                    <Flex
                      justifyContent={{ base: "", md: "flex-start" }}
                      flexWrap={{ base: "wrap", md: "nowrap" }}
                    >
                      {Array(newChoices[index])
                        .fill(1)
                        .map((_, row) => (
                          <Flex
                            key={row}
                            flexWrap="wrap"
                            flexDirection="column"
                            mb={{ base: 5, md: 0 }}
                          >
                            <FormLabel>{`Choice ${row + 1}`}</FormLabel>

                            <Input
                              required
                              type="text"
                              name="choice"
                              value={choices[index][row]}
                              onChange={(e) => updateChoices(index, row, e)}
                              mr={4}
                              mb={2}
                              width={200}
                            />
                            <Radio
                              isRequired
                              value={`${row}`}
                              onChange={(e) => updateCorrectAns(index, e)}
                            >
                              Correct answer
                            </Radio>
                          </Flex>
                        ))}
                    </Flex>
                  </RadioGroup>
                  <Flex justifyContent="space-between" mt={5}>
                    <Button
                      colorScheme="blue"
                      w="full"
                      mr={6}
                      className="button add"
                      type="button"
                      onClick={() => handleAddChoices(index)}
                    >
                      Add Choice
                    </Button>
                    <Button
                      w="full"
                      mr={6}
                      className="button add"
                      type="button"
                      onClick={() => handleRemoveChoices(index)}
                    >
                      Remove Choice
                    </Button>
                  </Flex>
                </Box>
                {index ? (
                  <Button
                    mt={30}
                    type="button"
                    className="button remove"
                    onClick={() => removeFormFields(index)}
                  >
                    Remove Question
                  </Button>
                ) : null}
                <Divider colorScheme="blue" my={45} />
              </Box>
            ))}
            <Box align="center">
              <Button
                mr={6}
                className="button add"
                type="button"
                onClick={addFormFields}
              >
                Add question
              </Button>
              <Button
                className="button submit"
                type="submit"
                colorScheme="blue"
              >
                Submit
              </Button>
            </Box>
          </form>
        </FormControl>
      </Box>
    </Center>
  );
};

export default CreateQuiz;
