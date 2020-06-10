import React, { useContext, useEffect, useState } from "react";
import { Tezos } from "@taquito/taquito";
import { TezosContext } from "../tezosContext";

export default function Balance() {
  const [balance, setBalance] = useState(null);
  const context = useContext(TezosContext);
  const { tk, publicKeyHash } = context;

  useEffect(() => {
    async function refreshBalance() {
      let balance = await tk.tz.getBalance(publicKeyHash);
      balance = Tezos.format("mutez", "tz", balance).toString();

      setBalance(balance);
    }

    refreshBalance();
  }, [tk, publicKeyHash]);

  return <>{balance} ꜩ</>;
}
