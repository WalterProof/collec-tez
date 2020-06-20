import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner, jsx } from "theme-ui";
import api from "../api";

export default function Tokens() {
  const [tokens, setTokens] = useState([]);
  const [isLoading, SetIsLoading] = useState(true);

  console.log(tokens);

  useEffect(() => {
    async function fetchData() {
      const tokens = await api.getTokens();
      setTokens(tokens);
      SetIsLoading(false);
    }

    fetchData();
  }, []);

  return isLoading ? (
    <Spinner />
  ) : (
    <Box
      sx={{
        display: "flex",
      }}
    >
      {tokens.map((token) => (
        <Box>
          <Heading>{token.meta.name}</Heading>
          <p>{token.meta.description}</p>
          <img src={token.meta.image} />
        </Box>
      ))}
    </Box>
  );
}
