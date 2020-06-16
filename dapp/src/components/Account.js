/** @jsx jsx */
import { useContext } from "react";
import { Button, Box, jsx } from "theme-ui";
import { TezosContext } from "../tezosContext";
import Balance from "./Balance";

export default function Account() {
  const context = useContext(TezosContext);

  return context.publicKeyHash ? (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          flexDirection: "column",
          fontWeight: "bold",
          px: 3,
        }}
      >
        <Box>{context.publicKeyHash}</Box>
        <Box sx={{ fontWeight: "bold" }}>
          <Balance />
        </Box>
      </Box>
      <Button onClick={() => context.resetTK()}>Sign Out</Button>
    </Box>
  ) : (
    <Button onClick={() => context.createTK()}>Sign In</Button>
  );
}

