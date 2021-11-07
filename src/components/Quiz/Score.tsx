import { Box, Text } from "@chakra-ui/layout";
import ChartScore from "./ChartScore";

type Props = {
  total: number;
  score: number;
};

const Score: React.FC<Props> = (props) => {
  return (
    <Box
      maxW={{ base: "xs", md: "500px" }}
      w="full"
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
      <Box py={4}>
        <ChartScore score={props.score} totalScore={props.total} />
      </Box>
    </Box>
  );
};

export default Score;
