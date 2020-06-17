import React, { useContext, useEffect, useState } from "react";
import { Tezos } from "@taquito/taquito";
import { TezosContext } from "../tezosContext";

export default function Balance() {
  const [balance, setBalance] = useState(null);
  const context = useContext(TezosContext);
  const { account, tk } = context;

  useEffect(() => {
    async function refreshBalance() {
      let balance = await tk.tz.getBalance(account.keyHash);
      balance = Tezos.format("mutez", "tz", balance).toString();

      setBalance(balance);
    }

    refreshBalance();
  }, [tk, account]);

  return <>{balance} ꜩ</>;
}
