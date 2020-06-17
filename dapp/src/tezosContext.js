import React, { Component } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { importKey } from "@taquito/signer";
import { BeaconWallet } from "@taquito/beacon-wallet";
import axios from "axios";

const TezosContext = React.createContext();

class TezosContextProvider extends Component {
  state = {
    publicKeyHash: null,
    tk: null,
    account: null,
  };

  resetTK = () => {
    this.setState({ publicKeyHash: null, tk: null });
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

    console.log(publicKeyHash);

    const account = await axios.post(`${process.env.REACT_APP_API}/users`, {
      keyHash: publicKeyHash,
    });

    this.setState({ account: account.data, publicKeyHash, tk });
  };

  render() {
    const { account, publicKeyHash, tk } = this.state;

    return (
      <TezosContext.Provider
        value={{
          account,
          publicKeyHash,
          tk,
          createTK: this.createTK,
          resetTK: this.resetTK,
        }}
      >
        {this.props.children}
      </TezosContext.Provider>
    );
  }
}

export { TezosContextProvider, TezosContext };
