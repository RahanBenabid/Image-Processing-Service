import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import imageService from "../services/imageService";
import ImageTransform from "../components/ImageTransform";
import { ArrowLeft, Download, RefreshCw, X } from "lucide-react";
import bgImage from "../assets/sign_inout/bg1.png";
import { saveAs } from "file-saver";
import { useCallback } from "react";

const ImageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transformationParams, setTransformationParams] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState(null); // Store the original image data

  useEffect(() => {
    // Change this condition to only check the ID
    if (!id) return;

    const fetchImage = async () => {
      try {
        setLoading(true);
        const imageData = await imageService.getImageById(id);
        console.log("Image loaded:", imageData.picture);
        setImage(imageData.picture);
        setOriginalImage(imageData.picture); // Store the original image
        setError(null);
      } catch (err) {
        console.error("Failed to fetch image:", err);
        setError("Failed to load image. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  const fetchImageAsBlob = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.error("Error fetching image as blob:", error);
      throw error;
    }
  };

  const transformImage = async () => {
    try {
      if (!image || !image._id) {
        console.error("No image to transform");
        return null;
      }

      console.log("Transforming image:", image._id);
      const response = await fetch(
        `http://localhost:3000/api/images/${image._id}/transform`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            resize: {
              width: 50,
              height: 50,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.publicUrl) {
        return data.publicUrl;
      } else {
        console.warn("No publicUrl in response:", data);
        alert("Image transformed, but no public URL provided.");
        return null;
      }
    } catch (error) {
      console.error("Transform error:", error);
      alert(error.message || "Failed to transform image");
      return null;
    }
  };

  const handleTransformComplete = async () => {
    try {
      const data = await imageService.getImageById(id);
      if (data && (!image || data.url !== image.url)) {
        console.log("Image was transformed, updating preview");
        setImage(data);
        setOriginalImage(data); 
        setPreviewImage(null); 
      } else {
        console.log("No change in image URL");
      }
    } catch (err) {
      console.error("Failed to refresh image:", err);
    }
  };
  const handlePreviewTransform = async () => {
    if (!image || !transformationParams) {
      console.error("No image or transformation parameters");
      return;
    }

    setPreviewLoading(true);
    try {
      const formData = new FormData();
      const imageBlob = await fetchImageAsBlob(originalImage.url);
      formData.append(
        "picture",
        imageBlob,
        originalImage.metadata?.fileName || "image.jpg",
      );
      const changesJson = JSON.stringify(transformationParams);
      formData.append("changes", changesJson);
      console.log("Sending preview request with params:", transformationParams);
      const response = await fetch("http://localhost:3000/api/images/preview", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Preview response error:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const previewBlob = await response.blob();

      const previewUrl = URL.createObjectURL(previewBlob);
      console.log("Preview image created:", previewUrl);
      setPreviewImage(previewUrl);
    } catch (error) {
      console.error("Preview transform error:", error);
      setError("Failed to preview transformation: " + error.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleTransformParamsChange = useCallback((params) => {
    setTransformationParams(params);
    console.log("Updated transformation params:", params);
  }, []);

  const handleDownload = async () => {
    const url = await transformImage();
    if (url) {
      
      const fileName = "downloaded-image.jpg";
      saveAs(url, fileName);
      setImage({ ...image, url });
    } else {
      console.error("No image URL available for download");
    }
  };

  const handleClearPreview = () => {
    setPreviewImage(null);
  };
  const handlePreviewChange = (newPreviewUrl) => {
    setPreviewImage(newPreviewUrl);
  };
  const displayImageSrc =
    previewImage || (image && `${image.url}?t=${new Date().getTime()}`);

  return (
    <div
      className="min-h-screen -m-2 mt-19 text-white bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <ArrowLeft size={16} />
            <span className="hidden md:block">Back to Dashboard</span>
          </button>

        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-800 text-red-200 p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Error</h3>
            <p>{error}</p>
          </div>
        ) : !image ? (
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-10 text-center">
            <h3 className="text-xl font-medium mb-2">Image not found</h3>
            <p className="text-gray-400 mb-6">
              The image you're looking for doesn't exist or was deleted
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all duration-300"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 bg-opacity-70 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="font-semibold flex items-center">
                    {previewImage ? (
                      <>
                        <span className="bg-purple-900 text-purple-100 text-xs px-2 py-1 rounded mr-2">
                          PREVIEW MODE
                        </span>
                        Image Preview (Unsaved)
                      </>
                    ) : (
                      "Image Preview"
                    )}
                  </h2>
                  <div className="flex items-center space-x-3">
                    {previewImage && (
                      <button
                        onClick={handleClearPreview}
                        className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={14} />
                        <span className="text-sm">Clear Preview</span>
                      </button>
                    )}
                    
                  </div>
                </div>
                <div className="p-6 flex justify-center">
                  {previewLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  ) : (
                    <img
                      src={displayImageSrc}
                      alt={image.name || "Image preview"}
                      className="max-w-full max-h-[70vh] object-contain"
                    />
                  )}
                </div>
                <div className="p-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                      <span className="block">Name: </span>
                      <span className="font-medium text-white">
                        {image.metadata && image.metadata.fileName
                          ? image.metadata.fileName
                          : "Untitled"}
                      </span>
                    </div>
                    {image.size && (
                      <div>
                        <span className="block">Size: </span>
                        <span className="font-medium text-white">
                          {(image.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                    )}
                    {image.dimensions && (
                      <div>
                        <span className="block">Dimensions: </span>
                        <span className="font-medium text-white">
                          {image.dimensions.width} × {image.dimensions.height}
                        </span>
                      </div>
                    )}
                    {image.format && (
                      <div>
                        <span className="block">Format: </span>
                        <span className="font-medium text-white">
                          {image.format.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <ImageTransform
                imageId={id}
                onTransformComplete={handleTransformComplete}
                onParamsChange={handleTransformParamsChange}
                onPreviewChange={handlePreviewChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
