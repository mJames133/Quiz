import { Route, Switch, Redirect } from "react-router-dom";
import Main from "./components/Main";
import Auth from "./components/Auth";
import { CSSReset } from "@chakra-ui/css-reset";
import { AuthContextProvider } from "./stores/auth-context";
import Header from "./components/NavBar/Navigation";
import { ChakraProvider } from "@chakra-ui/react";
import Quiz from "./components/Quiz/Quiz";
import CreateQuiz from "./components/Quiz/CreateQuiz";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <CSSReset />
        <Header />
        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/auth" component={Auth} />
          <PrivateRoute path="/create-quiz" component={CreateQuiz} />

          <Route path="/quiz/:quizId" component={Quiz} />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default App;
