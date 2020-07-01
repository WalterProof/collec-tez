#!/bin/bash

set -e

network=$1

PS3='Please select implementation: '
options=("nft_mutran" "nft-tablespoon")
select opt in "${options[@]}"
do
    case $opt in
        "nft_mutran")
            script="originate_nft_mutran"
            break
            ;;
        "nft-tablespoon")
            script="originate_nft-tablespoon"
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done

# call pytezos originate script to deploy the contract, and extract originated address
address=$(make contracts-run-script S=$script NETWORK=$1 | awk 'END{print}' | sed -e 's/\r//g')
# update .env file with address
sed -i -e "s/^FA2_ADDRESS=.*$/FA2_ADDRESS=$address/g" .env
# recreate the tools container so it has the new value
docker-compose up --force-recreate --no-deps -d tools

echo $address
