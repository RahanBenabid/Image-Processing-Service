#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RESET='\033[0m'

# ------

# Function to check if the server is running
check_server() {
  local host=$1
  local port=$2
  
  # Using netcat to see if the port is open
  nc -z "$host" "$port" > /dev/null 2>&1
  if [[ $? -ne 0 ]]; then
    echo "Error: Server is not running on $host:$port. Exiting."
    exit 1
  fi
}

SERVER="localhost"
PORT="3000"

echo "Checking if the server is running on $SERVER:$PORT..."
check_server "$SERVER" "$PORT"
echo "Server is running. Proceeding with the tests."
echo -e "\n"

# ------

# USER TEST

echo -e "${YELLOW}USER TEST${RESET}"

# Create a user instance
echo "Creating a new user instance..."
response=$(curl -s -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "zibizib",
    "password": "0000",
    "email": "nadimerahan@gmail.com"
  }')

echo $response

# Extract the `_id` value using jq for the user
user_id=$(echo "$response" | jq -r '.user._id')

# Check if user _id was successfully extracted
if [[ -z "$user_id" || "$user_id" == "null" ]]; then
  echo "Error: Failed to extract _id from the response. Exiting."
  exit 1
fi

echo "Extracted user _id: $user_id"
echo -e "\n"

# Login the user
echo "Login the user with the id: $user_id"
json=$(curl -s -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
      "password": "0000",
      "email": "nadimerahan@gmail.com"
    }')
token=$( jq -r ".token" <<<"$json" )
echo "the returned json: $json"
echo -e "\n"

# PROTECTED ROUTES

echo "Fetching all user models in the protected route..."
curl http://localhost:3000/api/users/protected -k -X GET \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json"
echo -e "\n"

# Get all the user models
echo "Fetching all user models..."
curl -s -X GET http://localhost:3000/api/users -H "Authorization: Bearer $token"
echo -e "\n"

# Get details of the created user instance
echo "Fetching details of the created user with _id: $user_id..."
curl -s -X GET http://localhost:3000/api/users/$user_id \
  -H "Authorization: Bearer $token" \
echo -e "\n"


# PICTURE TEST

echo -e "${YELLOW}PICTURE TEST${RESET}"

# Get all the picture models
echo "Fetching all picture models..."
curl -s -X GET http://localhost:3000/api/pictures -H "Authorization: Bearer $token"
echo -e "\n"

# Create a picture instance
echo "Creating a new picture instance..."
response=$(curl -s -X POST http://localhost:3000/api/pictures \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/images/photo.jpg",
    "filename": "photo.jpg",
    "user_id": "64b9cbb9655f1e1f1f8d9e9c",
    "changes_made": [{"resize": {"width": 800, "height": 600}}, {"filter": "grayscale"}]
  }')

# Extract the `_id` value using jq for the picture
picture_id=$(echo "$response" | jq -r '.request._id')

# Check if picture _id was successfully extracted
if [[ -z "$picture_id" || "$picture_id" == "null" ]]; then
  echo "Error: Failed to extract _id from the response. Exiting."
  exit 1
fi

echo "Extracted picture _id: $picture_id"
echo -e "\n"

# Get details of the created picture instance
echo "Fetching details of the created picture with _id: $picture_id..."
curl -s -X GET http://localhost:3000/api/pictures/$picture_id -H "Authorization: Bearer $token"
echo -e "\n"

# Delete the created picture instance
echo "Deleting the picture instance with id: $picture_id..."
delete_picture_response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:3000/api/pictures/$picture_id -H "Authorization: Bearer $token")

if [[ "$delete_picture_response" -eq 204 ]]; then
  echo -e "${GREEN}204 DELETED SUCCESSFULLY${RESET} for picture with _id: $picture_id (HTTP status: $delete_picture_response)"
else
  echo "Failed to delete the picture with _id: $picture_id (HTTP status: $delete_picture_response)"
fi
echo -e "\n"

# ------


# Delete the created user instance
echo "Deleting the user instance with id: $user_id..."
delete_user_response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:3000/api/users/$user_id -H "Authorization: Bearer $token")

if [[ "$delete_user_response" -eq 204 ]]; then
  echo -e "${GREEN}204 DELETED SUCCESSFULLY${RESET} for user with _id: $user_id (HTTP status: $delete_user_response)"
else
  echo "Failed to delete the user with _id: $user_id (HTTP status: $delete_user_response)"
fi
echo -e "\n"