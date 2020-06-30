type tokenOwner is address
type tokenId is nat
type tokenAmount is nat

type store is record [
    tzip12NFTAddress: address 
]

type transferContents is record [
    to_: tokenOwner ;
    token_id: tokenId ;
    amount: tokenAmount
]

type transfer is record [
    from_: tokenOwner;
    txs: list(transferContents)
]

type transferContentsMichelson is michelson_pair_right_comb(transferContents)

type transferAuxiliary is record [
    from_: tokenOwner;
    txs: list(transferContentsMichelson)
]

type transferParam is list(transferAuxiliary)

type tzip12NFTTransfer is contract(transferParam)

type action is
| Transfer of transferParam
| Update_tzip12NFT of address

(*
The transfer function is used internally by the contract and
changes owner of a token id.
*)
function transfer(const transferParam : transferParam; const store : store): (list(operation) * store) is block {
    const tzip12NFTAddress : address = store.tzip12NFTAddress ;
    const tzip12NFT : tzip12NFTTransfer =
      case (Tezos.get_entrypoint_opt ("%transfer", store.tzip12NFTAddress) : option (tzip12NFTTransfer)) of
        Some (contract) -> contract
      | None -> (failwith ("Contract not found.") : tzip12NFTTransfer)
    end;
    const op : operation = Tezos.transaction (transferParam, 0tez, tzip12NFT);
    const ops : list (operation) = list [op]
} with (ops, store)


(* Default function that represents our contract, it's sole purpose here is the entrypoint routing *)
function main (const action : action; var store : store) : (list(operation) * store)
    is case action of
    (* 
        Unwrap the `Transfer(...)` parameters and invoke the transfer function.
        The return value of `transfer(...)` is then returned as a result of `main(...)` as well.
     *)
    | Transfer(transferParam) -> transfer(transferParam, store)
    | Update_tzip12NFT -> ((nil : list(operation)), store)
    end
