echo "Deleting the picture instance with id: $picture_id..."
delete_picture_response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:3000/api/pictures/67b4a39a6496ca578641678e)
if [[ "$delete_picture_response" -eq 204 ]]; then
  echo -e "${GREEN}204 DELETED SUCCESSFULLY${RESET} for picture with _id: $picture_id (HTTP status: $delete_picture_response)"
else
  echo "Failed to delete the picture with _id: $picture_id (HTTP status: $delete_picture_response)"
fi
echo -e "\n"