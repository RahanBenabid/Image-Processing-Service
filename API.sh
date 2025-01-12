
# PICTURE

# get all the picture models
curl -X GET http://localhost:3000/api/pictures

# get one picture
curl -X GET http://localhost:3000/api/pictures/6782cbb3b79a92806179e1e6

# create a picture instance
curl -X POST http://localhost:3000/api/pictures \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/images/photo.jpg",
    "filename": "photo.jpg",
    "user_id": "64b9cbb9655f1e1f1f8d9e9c", 
    "changes_made": [{"resize": {"width": 800, "height": 600}}, {"filter": "grayscale"}]
  }'
  
  
# USER

curl -X