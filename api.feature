# $host = http://localhost:5001/collec-tez/us-central1

POST $host/users
Content-Type: application/json
{
	"keyHash": "tz123"
}

GET $host/tokens
