import { useContext, createContext, useState } from "react";
const QuizContext = createContext<{
  editQuiz: boolean;
  changeEditQuiz: (state: boolean) => void;
}>({
  editQuiz: false,
  changeEditQuiz: () => {},
});

export const useStore = () => useContext(QuizContext);

type Props = {
  children: any;
};

export const QuizContextProvider: React.FC<Props> = (props) => {
  const [editQuiz, setEditQuiz] = useState(false);

  const changeEditQuiz = (state: boolean) => {
    setEditQuiz(state);
  };

  const contextValue: {
    editQuiz: boolean;
    changeEditQuiz: (state: boolean) => void;
  } = {
    editQuiz,
    changeEditQuiz,
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {props.children}
    </QuizContext.Provider>
  );
};
