#include "../types.religo"
type tokenOwners = big_map(tokenId, tokenOwner);
type tokenMeta = big_map(tokenId, tokenHash);
type storage = {
    tokenOwners: tokenOwners,
    tokenMeta: tokenMeta
};
