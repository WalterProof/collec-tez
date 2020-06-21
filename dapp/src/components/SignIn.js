/** @jsx jsx */
import { useContext, useState } from "react";
import { Box, Button, Input, Label, Text, jsx } from "theme-ui";
import { TezosContext } from "../tezosContext";

export default function SignIn() {
  const context = useContext(TezosContext);
  const { account, createAccount } = context;
  const [username, setUsername] = useState("");

  return (
    <Box
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        createAccount(username);
      }}
    >
      <Text my={1}>
        Thanks for joining {account.keyHash}! <br />
        Could you please enter a username so we can identify you on the
        platform.
      </Text>
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
  );
}
