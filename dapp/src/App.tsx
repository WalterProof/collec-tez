/** @jsx jsx */
// eslint-disable-next-line
import React, { useEffect } from "react";
import { Box, Container, Heading, jsx, ThemeProvider } from "theme-ui";
import { ReactComponent as Logo } from "./svg/logo.svg";
import theme from "./theme";
import setupTaquito from "./setupTaquito";

setupTaquito(process.env.NODE_ENV)

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container p={1}>
        <header
          sx={{
            display: "flex",
            flexDirection: ["column", "row"],
            justifyContent: "center",
            alignItems: "center",
            my: 4,
          }}
        >
          <Logo sx={{ fill: "royalblue" }} />
          <Heading
            as="h1"
            sx={{ order: [0, 1], variant: "text.heading", pl: 3 }}
          >
            Collecꜩ
          </Heading>
        </header>
        <div>
          <Box sx={{ textAlign: "center", my: 2 }}></Box>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
