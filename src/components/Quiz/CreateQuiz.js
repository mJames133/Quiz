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
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { realdatabase } from "../firebase";

const CreateQuiz = () => {
  const nameRef = useRef();
  const [choices, setChoices] = useState([[]]);
  const [questions, setQuestions] = useState(1);
  const [correctAns, setCorrectAns] = useState("1");
  const [formValues, setFormValues] = useState([{}]);

  const handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const updateChoices = (index, row, e) => {
    let newArr = [...choices];
    newArr[index][row] = e.target.value;
    setChoices(newArr);
  };
  const addFormFields = () => {
    setFormValues([...formValues, []]);
    setChoices([...choices, []]);
    setQuestions((prevstate) => (prevstate += 1));
  };

  const removeFormFields = (i) => {
    let newFormValues = [...formValues];
    let newChoiceValues = [...choices];

    newFormValues.splice(i, 1);
    newChoiceValues.splice(i, 1);

    setFormValues(newFormValues);
    setChoices(newChoiceValues);
    setQuestions((prevstate) => (prevstate -= 1));
  };

  function QuestionList(id) {
    let questionList = [];
    for (let i = 0; i < +questions; i++) {
      let answers = [];
      for (let j = 0; j < 4; j++) {
        answers.push({
          id: "A",
          name: choices[i][j],
          isCorrect: correctAns == j ? true : false,
        });
      }
      questionList.push({
        question: formValues[i].question,
        answers,
      });
    }
    return questionList;
  }

  const handleSubmit = () => {
    const enteredName = nameRef.current.value;

    realdatabase.ref().child("/list").push({
      name: enteredName,
      questions: QuestionList(),
    });
  };

  return (
    <Center py={9} flexDirection="column">
      <Heading>Create Quiz</Heading>
      <Box width={700}>
        <FormControl>
          <FormLabel htmlFor="name" id="name">
            Quiz Name
          </FormLabel>
          <Input
            required
            ref={nameRef}
            id="name"
            type="text"
            placeholder="Enter quiz name"
            mb={10}
            width={300}
          />
          <Text align="center" fontSize="3xl" fontWeight="bold">
            Questions
          </Text>
          {formValues.map((element, index) => (
            <Box pb={20} className="form-inline" key={index}>
              <Box>
                <Box mb={10}>
                  <FormLabel>Question</FormLabel>
                  <Input
                    type="text"
                    name="question"
                    value={element.question || ""}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Box>
                <RadioGroup>
                  <Box display="flex" justifyContent="space-between">
                    {Array(4)
                      .fill(1)
                      .map((_, row) => (
                        <Box key={row}>
                          <FormLabel>{`Choice ${row + 1}`}</FormLabel>

                          <Input
                            type="text"
                            name="choice"
                            value={choices[index][row]}
                            onChange={(e) => updateChoices(index, row, e)}
                            width={40}
                          />
                          <Radio
                            value={`${row}`}
                            onClick={(e) => setCorrectAns(e.target.value)}
                          >
                            Correct answer
                          </Radio>
                        </Box>
                      ))}
                  </Box>
                </RadioGroup>
              </Box>
              {index ? (
                <Button
                  mt={30}
                  type="button"
                  className="button remove"
                  onClick={() => removeFormFields(index)}
                >
                  Remove
                </Button>
              ) : null}
            </Box>
          ))}
          <div className="button-section">
            <Button
              mr={6}
              className="button add"
              type="button"
              onClick={addFormFields}
            >
              Add question
            </Button>
            <Button className="button submit" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </FormControl>
      </Box>
    </Center>
  );
};

export default CreateQuiz;
