# $host = http://localhost:5001/collec-tez/us-central1

POST $host/users
Content-Type: application/json
{
	"keyHash": "tz123"
}

GET $host/tokens


GET $host/chains/main/blocks/head/context/contracts/tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb
