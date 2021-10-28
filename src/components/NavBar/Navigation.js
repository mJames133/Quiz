import { useState, useContext } from "react";
import { Container, Flex, Box, Text, Link as LinkText } from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../stores/auth-context";
import { useHistory } from "react-router";

const MenuItem = ({ children, islast, to = "/" }) => {
  return (
    <Text
      mb={{ base: islast ? 0 : 8, sm: 0 }}
      mr={{ base: 0, sm: islast ? 0 : 8 }}
      display="block"
      fontSize="lg"
      fontWeight="bold"
    >
      <Link to={to}>{children}</Link>
    </Text>
  );
};

const Header = (props) => {
  const { currentUser, logout } = useAuth();
  const [show, setShow] = useState(false);
  const history = useHistory();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    history.push("/");
  };

  return (
    <Flex as="nav" mb={4} p={4} bg={"blue.500"} color={"white"} {...props}>
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center" wrap="wrap" {...props}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              <Link to="/">Quiz</Link>
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
              {currentUser ? (
                <MenuItem to="/create-quiz">Create Quiz</MenuItem>
              ) : (
                ""
              )}
              {currentUser ? (
                <LinkText
                  style={{ textDecoration: "none" }}
                  fontSize="lg"
                  fontWeight="bold"
                  islast="true"
                  onClick={handleLogout}
                >
                  Logout
                </LinkText>
              ) : (
                <MenuItem to="/auth" islast="true">
                  Sign In
                </MenuItem>
              )}
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
};

export default Header;
