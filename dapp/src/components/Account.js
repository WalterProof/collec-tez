/** @jsx jsx */
import { useContext } from "react";
import { Button, Box, Heading, jsx } from "theme-ui";
import { TezosContext } from "../tezosContext";
import Balance from "./Balance";

export default function Account() {
  const context = useContext(TezosContext);

  return context.publicKeyHash ? (
    <Box>
      <Heading>{context.publicKeyHash}</Heading>
      <Heading sx={{ textAlign: "right" }}>
        <Balance />
      </Heading>
    </Box>
  ) : (
    <Button onClick={() => context.createTK()}>Connect</Button>
  );
}

