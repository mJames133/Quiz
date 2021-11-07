import { Route, Switch, Redirect } from "react-router-dom";
import Main from "./components/Main";
import Auth from "./components/Auth";
import { CSSReset } from "@chakra-ui/css-reset";
import { AuthContextProvider } from "./stores/auth-context";
import Header from "./components/NavBar/Navigation";
import { ChakraProvider } from "@chakra-ui/react";
import Quiz from "./components/Quiz/Quiz";
import Users from "./components/Users";
import CreateQuiz from "./components/Quiz/CreateQuiz";
import { QuizContextProvider } from "./stores/quiz-context";
import { PrivateRoute, PrivateModRoute } from "./PrivateRoute";

function App() {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <QuizContextProvider>
          <CSSReset />
          <Header />
          <Switch>
            <Route path="/Quiz/" exact component={Main} />
            <Route path="/Quiz/auth" component={Auth} />
            <PrivateModRoute path="/Quiz/create-quiz" component={CreateQuiz} />
            <PrivateModRoute
              path="/Quiz/edit-quiz/:IdQuiz"
              component={CreateQuiz}
            />
            <PrivateRoute path="/Quiz/users" component={Users} />

            <Route path="/Quiz/quiz/:quizId" component={Quiz} />
            <Route path="*">
              <Redirect to="/Quiz/" />
            </Route>
          </Switch>
        </QuizContextProvider>
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default App;
