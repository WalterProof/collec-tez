import { Tezos } from "@taquito/taquito";
import { importKey } from "@taquito/signer";
import { TezBridgeSigner } from "@taquito/tezbridge-signer";

export default async (env: string) => {
  if (["development", "test"].indexOf(env) >= 0) {
    Tezos.setProvider({
      rpc: process.env.REACT_APP_RPC,
    });

    import("./faucet.json")
      .then((FAUCET_KEY: any) => {
        importKey(
          Tezos,
          FAUCET_KEY.email,
          FAUCET_KEY.password,
          FAUCET_KEY.mnemonic.join(" "),
          FAUCET_KEY.secret
        );
      })
      .catch((e) => console.log(e));
  } else {
    Tezos.setProvider({ signer: new TezBridgeSigner() });
  }
};

