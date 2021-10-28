import { Box, Text } from "@chakra-ui/layout";

const Score = (props) => {
  return (
    <Box
      maxW={"500px"}
      w={"full"}
      bg="blue.500"
      pb={8}
      boxShadow={"2xl"}
      overflow={"hidden"}
      rounded={"md"}
    >
      <Box bg="gray.800">
        <Text
          color="white"
          textAlign="center"
          textTransform="uppercase"
          fontSize="20"
          py={3}
        >
          {`Score: ${props.score} / ${props.total}`}
        </Text>
      </Box>
    </Box>
  );
};

export default Score;
