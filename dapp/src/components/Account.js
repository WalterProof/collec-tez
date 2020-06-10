/** @jsx jsx */
// eslint-disable-next-line
import React from "react";
import { Button, Box, Heading, jsx } from "theme-ui";
import { TezosContextConsumer } from "../tezosContext";
import { Balance } from "@taquito/react-components";

function Account() {
  return (
    <TezosContextConsumer>
      {({ publicKeyHash, tk, createTK }) => {
        return publicKeyHash ? (
          <Box>
            <Heading>{publicKeyHash}</Heading>
            <Heading sx={{ textAlign: "right" }}>
              <Balance address={publicKeyHash} format="tz" />
            </Heading>
          </Box>
        ) : (
          <Button onClick={() => createTK()}>Connect</Button>
        );
      }}
    </TezosContextConsumer>
  );
}

export default Account;
