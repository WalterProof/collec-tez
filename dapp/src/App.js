/** @jsx jsx */
// eslint-disable-next-line
import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Label,
  jsx,
  ThemeProvider,
} from "theme-ui";
import { ReactComponent as Logo } from "./svg/logo.svg";
import { TezosContext } from "./tezosContext";
import theme from "./theme";
import Account from "./components/Account";

function App() {
  const context = useContext(TezosContext);
  const { account, createAccount } = context;
  const [username, setUsername] = useState("");

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
            <Box sx={{ textAlign: "center", my: 2 }}></Box>
          </div>
        </Container>
      ) : (
        <Container p={4}>
          <Box
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              createAccount(username);
            }}
          >
            <Label htmlFor="username">Username</Label>
            <Input
              name="username"
              id="username"
              value={username}
              mb={3}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button>Submit</Button>
          </Box>
        </Container>
      )}
    </ThemeProvider>
  );
}

export default App;
