# Image-Processing-Service

This project aims to be a free clone of the Cloudinary website, it uses `Node.js` for the handling requests and `Python` for processing images.

1. Storage Organization:
Cloud Storage Buckets:
- originals/           (original uploaded images)
- transformed/         (processed versions)

2. Redis Cache Structure:
CopyKeys:
- image:{id}:{transformations} -> public_url
- image:{id}:metadata -> {width, height, format, ...}

TODO:
- [ ] make sure that only the admin can access certain routes
- [ ] ratelimit the upload, but don’t be as strict in other routes
- [x] upload picture with multer
- [ ] logout functionality
- [ ] should serve the transformed file in a public Url
- [ ] when user is deleted, all his pics should be
- [ ] when a user has pictures, he cannot be deleted
- [ ] make sure the global error handler is working