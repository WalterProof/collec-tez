import React, { Component } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { importKey } from "@taquito/signer";
import { BeaconWallet } from "@taquito/beacon-wallet";
import axios from "axios";

const TezosContext = React.createContext();

class TezosContextProvider extends Component {
  state = {
    tk: null,
    account: null,
  };

  createAccount = async (username) => {
    const account = await axios.put(`${process.env.REACT_APP_API}/users`, {
      keyHash: this.state.publicKeyHash,
      username: username,
    });
    this.setState({ account: account.data });
  };

  createTK = async () => {
    const tk = new TezosToolkit();
    let publicKeyHash;

    if (["development", "test"].indexOf(process.env.NODE_ENV) >= 0) {
      tk.setProvider({
        rpc: process.env.REACT_APP_RPC,
      });

      await importKey(tk, process.env.REACT_APP_SK);

      publicKeyHash = await tk.signer.publicKeyHash();
    } else {
      const beaconWallet = new BeaconWallet({ name: "test" });
      await beaconWallet.requestPermissions("carthagenet");
      tk.setProvider({ wallet: beaconWallet });

      publicKeyHash = await tk.wallet.pkh();
    }

    const account = await axios.post(`${process.env.REACT_APP_API}/users`, {
      keyHash: publicKeyHash,
    });

    this.setState({ account: account.data, tk });
  };

  resetTK = () => {
    this.setState({ account: null, tk: null });
  };

  render() {
    const { account, tk } = this.state;

    return (
      <TezosContext.Provider
        value={{
          account,
          createAccount: this.createAccount,
          createTK: this.createTK,
          resetTK: this.resetTK,
          tk,
        }}
      >
        {this.props.children}
      </TezosContext.Provider>
    );
  }
}

export { TezosContextProvider, TezosContext };
