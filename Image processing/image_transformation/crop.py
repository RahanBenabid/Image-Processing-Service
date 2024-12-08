#!/usr/bin/env python3

def crop(img, startX, startY, endX, endY):
	width, height = img.size
	img = img.crop((startX, startY, endX, endY))
	return img