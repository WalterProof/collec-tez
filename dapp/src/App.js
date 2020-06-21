/** @jsx jsx */
// eslint-disable-next-line
import React, { useContext, useState, useEffect } from "react";
import { Box, Container, Heading, jsx, ThemeProvider } from "theme-ui";
import { ReactComponent as Logo } from "./svg/logo.svg";
import { TezosContext } from "./tezosContext";
import theme from "./theme";
import Account from "./components/Account";
import Tokens from "./components/Tokens";
import SignIn from "./components/SignIn";

function App() {
  const context = useContext(TezosContext);
  const { account } = context;

  return (
    <ThemeProvider theme={theme}>
      {!account || (account && account.username) ? (
        <Container p={1}>
          <header
            sx={{
              display: "flex",
              alignItems: "center",
              my: 4,
            }}
          >
            <Logo sx={{ fill: "royalblue" }} />
            <Heading as="h1">CollecTEZ</Heading>
            <Box sx={{ marginLeft: "auto" }}>
              <Account />
            </Box>
          </header>
          <div>
            <Box sx={{ my: 2 }}>
              <Tokens />
            </Box>
          </div>
        </Container>
      ) : (
        <Container p={4}>
          <SignIn />
        </Container>
      )}
    </ThemeProvider>
  );
}

export default App;
