type tokenOwner is address
type tokenId is nat
type tokenHash is string

type tokenOwners is big_map(tokenId, tokenOwner)
type tokenMeta is big_map(tokenId, tokenHash)
type storage is record [
    tokenOwners: tokenOwners;
    tokenMeta: tokenMeta
]

type transferParam is record [
    toAddress : tokenOwner;
    tokenId : tokenId
]

type action is
| Transfer of transferParam
| Nothing of unit

function failUnlessSenderIsOwner(const tokenOwner : tokenOwner) : unit is
  if sender =/= tokenOwner then failwith("owner address needs to be equal to the sender") else Unit

(*
The transfer function is used internally by the contract and
changes owner of a token id.
*)
function transfer(const transferParam : transferParam; const storage : storage): (list(operation) * storage) is block {
    case storage.tokenOwners[transferParam.tokenId] of
        | None -> failwith("this nft does not exists")
        | Some(tokenOwner) -> block {
            failUnlessSenderIsOwner(tokenOwner);
            storage.tokenOwners[transferParam.tokenId] := transferParam.toAddress
        }
    end;
} with ((nil : list(operation)), storage)

(* Default function that represents our contract, it's sole purpose here is the entrypoint routing *)
function main (const action : action; var storage : storage) : (list(operation) * storage)
    is case action of
    (* 
        Unwrap the `Transfer(...)` parameters and invoke the transfer function.
        The return value of `transfer(...)` is then returned as a result of `main(...)` as well.
     *)
    | Transfer(transferParam) -> transfer(transferParam, storage)
    | Nothing -> ((nil : list(operation)), storage)
    end
