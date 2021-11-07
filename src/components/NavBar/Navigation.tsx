import React, { useState } from "react";
import { Container, Flex, Box, Text, Link as LinkText } from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../stores/auth-context";
import { useStore } from "../../stores/quiz-context";

const Header = () => {
  const { currentUser, logout, roles } = useAuth();
  const [show, setShow] = useState(false);
  const history = useHistory();
  const {changeEditQuiz} = useStore();

  const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    logout();
    history.push("/Quiz/");
  };

  const clickHandler = () => {
    changeEditQuiz(false);
  };

  interface Props {
    isLast?: boolean;
    isCreate?: boolean;
    to: string;
    children: React.ReactNode;
  }

  const MenuItem = ({
    isLast = false,
    isCreate = false,
    to = "/",
    children,
  }: Props) => {
    return (
      <Text
        mb={{ base: isLast ? 0 : 8, sm: 0 }}
        mr={{ base: 0, sm: isLast ? 0 : 8 }}
        display="block"
        fontSize="lg"
        fontWeight="bold"
      >
        {isCreate && (
          <Link to={to} onClick={clickHandler}>
            {children}
          </Link>
        )}
        {!isCreate && <Link to={to}>{children}</Link>}
      </Text>
    );
  };

  return (
    <Box
      as="nav"
      mb={4}
      p={4}
      bg={"blue.500"}
      color={"white"}
      position="sticky"
    >
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center" wrap="wrap">
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              <Link to="/Quiz/">Quiz</Link>
            </Text>
          </Box>

          <Box
            display={{ base: "block", md: "none" }}
            onClick={() => setShow(!show)}
          >
            {show ? <CloseIcon /> : <HamburgerIcon />}
          </Box>

          <Box
            display={{ base: show ? "block" : "none", md: "block" }}
            flexBasis={{ base: "100%", md: "auto" }}
          >
            <Flex
              align="center"
              justify={["center", "space-between"]}
              direction={["column", "row"]}
            >
              {currentUser && roles[0].isAdmin && (
                <MenuItem to="/Quiz/users">Users</MenuItem>
              )}
              {currentUser && (roles[0].isMod || roles[0].isAdmin) && (
                <MenuItem isCreate={true} to="/Quiz/create-quiz">
                  Create Quiz
                </MenuItem>
              )}
              {currentUser ? (
                <LinkText
                  style={{ textDecoration: "none" }}
                  fontSize="lg"
                  fontWeight="bold"
                  onClick={handleLogout}
                >
                  Logout
                </LinkText>
              ) : (
                <MenuItem to="/Quiz/auth" isLast={true}>
                  Sign In
                </MenuItem>
              )}
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
