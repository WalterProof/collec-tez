#!/bin/bash

set -e

# call pytezos originate script to deploy the contract, and extract originated address
address=$(make contracts-run-script SCRIPT=originate | awk 'END{print}' | sed -e 's/\r//g')
# update .env file with address
sed -i -e "s/^FA2_ADDRESS=.*$/FA2_ADDRESS=$address/g" .env
# recreate the tools container so it has the new value
docker-compose up --force-recreate --no-deps -d tools

echo $address
