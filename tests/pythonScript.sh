#!/usr/bin/env bash

set -euo pipefail

INPUT_IMAGE="/Users/RahanBen/Downloads/test/python/input.jpg"
OUTPUT_IMAGE="/Users/RahanBen/Downloads/test/python/output.png"
PYTHON_SCRIPT="./../image_processing/main.py"

chmod +x "$PYTHON_SCRIPT"

cat > test_transformation.json << EOF
{
	"resize": {
		"width": 800,
		"height": 600
	},
	"filters": {
		"thumbnail": {
			"width": 200,
			"height": 200
		},
		"sharpen": 3.5,
		"blur": 5,
		"brightness": 1.2,
		"contrast": 1.5,
		"sepia": true
	},
	"compress": {
		"quality": 90
	},
	"format": "jpeg"
}
EOF

echo "Created transformation JSON file"

if [[ ! -f "$INPUT_IMAGE" ]]; then
	echo "Error: Input image $INPUT_IMAGE not found"
	exit 1
fi

echo "processing image manually"

cat "$INPUT_IMAGE" | "$PYTHON_SCRIPT" "$(cat test_transformation.json)" > $OUTPUT_IMAGE

if [ $? -eq 0 ] && [ -f "$OUTPUT_IMAGE" ]; then
	echo "Success! processed images saved as '$OUTPUT_IMAGE'"
	
	ORIGINAL_SIZE=$(du -h "$INPUT_IMAGE" | cut -f1)
	PROCESSED_SIZE=$(du -h "$OUTPUT_IMAGE" | cut -f1)
	
	echo "Original image size: $ORIGINAL_SIZE"
	echo "Processed image size: $PROCESSED_SIZE"
	
	if command -version identify &> /dev/null; then
		echo "Original image details:"
		identify "$INPUT_IMAGE"
		echo "Processed image details:"
		identify "$OUTPUT_IMAGE"
	fi
else
	echo "Error: Image processing failed"
	exit 1
fi

rm test_transformation.json

echo "Test completed"
	
	
	