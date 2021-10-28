import { useState, useRef } from "react";
import { Flex, Stack, Box, Heading, Link } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Alert } from "@chakra-ui/alert";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useHistory } from "react-router";
import { useAuth } from "../stores/auth-context";

function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const { signUp, login } = useAuth();
  const history = useHistory();

  const authSubmitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setError("");
    setIsLoading(true);

    if (isLogin) {
      try {
        login(enteredEmail, enteredPassword);
        history.replace("/");
      } catch {
        setError("Failed to sign in");
      }
    } else {
      try {
        signUp(enteredEmail, enteredPassword);
        history.replace("/");
      } catch {
        setError("Failed to create an account");
      }
    }
    setIsLoading(false);
  };

  const authSwitchHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <Flex
      width="full"
      pt={{ base: 0, md: 12 }}
      align="center"
      justifyContent="center"
    >
      <Box
        borderWidth={{ base: 0, md: 1 }}
        width="full"
        maxWidth="500px"
        px={4}
        textAlign="center"
        borderRadius={4}
      >
        <Box my={4}>
          <form onSubmit={(e) => authSubmitHandler(e)}>
            {error && <Alert status="error">{error}</Alert>}
            <Heading>{isLogin ? "Login" : "Register"}</Heading>
            <Box p={4}>
              <FormControl>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input
                  id="email"
                  type="email"
                  ref={emailInputRef}
                  placeholder="Enter your email address"
                  required
                />
                <FormLabel htmlFor="password" pt={4}>
                  Password
                </FormLabel>
                <Input
                  id="password"
                  type="password"
                  ref={passwordInputRef}
                  placeholder="Enter your password"
                  required
                />
              </FormControl>
              <Stack pt={2}>
                <Link onClick={authSwitchHandler}>
                  {isLogin
                    ? "Create new account"
                    : "Login with an existing account"}
                </Link>
              </Stack>
            </Box>
            <Button
              type="submit"
              disabled={isLoading}
              width="full"
              colorScheme="blue"
            >
              {isLoading
                ? "Sending request..."
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}

export default Auth;
