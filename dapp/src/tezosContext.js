import React, { Component } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { importKey } from "@taquito/signer";
import { BeaconWallet } from "@taquito/beacon-wallet";

const TezosContext = React.createContext();

class TezosContextProvider extends Component {
  state = {
    publicKeyHash: null,
    tk: null,
  };

  createTK = async () => {
    const tk = new TezosToolkit();

    if (["development", "test"].indexOf(process.env.NODE_ENV) >= 0) {
      tk.setProvider({
        rpc: process.env.REACT_APP_RPC,
      });

      await importKey(tk, process.env.REACT_APP_SK);

      const publicKeyHash = await tk.signer.publicKeyHash();
      this.setState({ publicKeyHash, tk });
    } else {
      const beaconWallet = new BeaconWallet({ name: "test" });
      await beaconWallet.requestPermissions("carthagenet");
      tk.setProvider({ wallet: beaconWallet });

      const publicKeyHash = await tk.wallet.pkh();
      this.setState({ publicKeyHash, tk });
    }
  };

  render() {
    const { publicKeyHash, tk } = this.state;

    return (
      <TezosContext.Provider
        value={{ publicKeyHash, tk, createTK: this.createTK }}
      >
        {this.props.children}
      </TezosContext.Provider>
    );
  }
}

export { TezosContextProvider, TezosContext };
