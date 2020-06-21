#include "../types.religo"
type tokenOwners = big_map(tokenId, tokenOwner);
type tokenMeta = big_map(tokenId, bytes);
type storage = {
    tokenOwners: tokenOwners,
    tokenMeta: tokenMeta
};
