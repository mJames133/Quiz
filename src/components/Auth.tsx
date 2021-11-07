import { useEffect, useState } from "react";
import { Flex, Stack, Box, Heading, Link } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useAuth } from "../stores/auth-context";
import { useForm } from "react-hook-form";

interface FormValues {
  auth: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;

}

interface ErrorType {
  code: string;
}

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, login } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const authSubmit = (values: FormValues) => {
    setIsLoading(true);

    if (isLogin) {
      login(values.email, values.password).catch(() =>
        setError("auth", {
          type: "auth",
          message: "Incorrect email or password",
        })
      );
    } else {

      if(values.password !== values.confirmPassword)
      {
        setError('confirmPassword', {
          type: 'password',
          message: 'Password fields dont match'
        })
      }

      signUp(
        values.email,
        values.password,
        values.firstName,
        values.lastName
      ).catch((err: ErrorType) => {
        const errorCode = err.code;
        if (errorCode == "auth/email-already-in-use") {
          setError("email", {
            type: "email",
            message: "Email is already in use.",
          });
        }
        if (errorCode == "auth/invalid-email") {
          setError("email", {
            type: "email",
            message: "Email address is not valid.",
          });
        }
      });
    }
    setIsLoading(false);
  };

  const authSwitchHandler = () => {
    reset();
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
          <form onSubmit={handleSubmit(authSubmit)}>
            <Heading>{isLogin ? "Login" : "Register"}</Heading>
            <Box p={4}>
              {!isLogin && (
                <Box>
                  <FormControl isInvalid={Boolean(errors?.firstName)}>
                    <FormLabel pt={4} htmlFor="firstName">
                      First name
                    </FormLabel>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      {...register("firstName", {
                        required: "This is required",
                        minLength: {
                          value: 4,
                          message: "Minimum length should be 4",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.firstName && errors.firstName.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={Boolean(errors?.lastName)}>
                    <FormLabel pt={4} htmlFor="lastName">
                      Last name
                    </FormLabel>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      {...register("lastName", {
                        required: "This is required",
                        minLength: {
                          value: 4,
                          message: "Minimum length should be 4",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.lastName && errors.lastName.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              )}
              <FormControl isInvalid={Boolean(errors?.email || errors?.auth)}>
                <FormLabel pt={4} htmlFor="email">
                  Email address
                </FormLabel>
                <Input
                  id="email"
                  placeholder="Enter your email address"
                  {...register("email", {
                    required: "This is required",
                    minLength: {
                      value: 4,
                      message: "Minimum length should be 4",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                  {errors.auth && errors.auth.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={Boolean(errors?.password || errors?.auth)}
              >
                <FormLabel pt={4} htmlFor="password">
                  Password
                </FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "This is required",
                    minLength: {
                      value: 6,
                      message: "Minimum length should be 6",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.auth && errors.auth.message}
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>

              {!isLogin && (
                <FormControl isInvalid={Boolean(errors?.confirmPassword)}>
                  <FormLabel pt={4} htmlFor="password">
                    Confirm Password
                  </FormLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Enter your password"
                    {...register("confirmPassword", {
                      required: true,
                    })}
                  />
                  <FormErrorMessage>
                    {errors.confirmPassword && errors.confirmPassword.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Box>
            <Button
              type="submit"
              isLoading={isSubmitting}
              width="full"
              colorScheme="blue"
            >
              {isLoading
                ? "Sending request..."
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </Button>
            <Stack pt={2}>
              <Link onClick={authSwitchHandler}>
                {isLogin
                  ? "Create new account"
                  : "Login with an existing account"}
              </Link>
            </Stack>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}

export default Auth;
