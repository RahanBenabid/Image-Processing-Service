#!/usr/bin/env bash

set -euo pipefail

curl -X POST http://localhost:3000/api/images/preview --output "./preview.jpeg" \
	-H "Content-Type: multipart/form-data" \
	-F "picture=@/Users/RahanBen/Desktop/lel.jpeg" \
	-F "changes={\"resize\":{\"width\":80,\"height\":60},\"filters\":{\"blur\":5}};type=application/json"
