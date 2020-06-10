/** @jsx jsx */
// eslint-disable-next-line
import React, { useState } from "react";
import { Box, Container, Heading, jsx, ThemeProvider } from "theme-ui";
import { ReactComponent as Logo } from "./svg/logo.svg";
import theme from "./theme";
import Account from "./components/Account";

function App() {
  return (
    <ThemeProvider theme={theme}>
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
          <Box sx={{ textAlign: "center", my: 2 }}></Box>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
