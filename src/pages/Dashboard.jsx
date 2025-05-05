import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import imageService from "../services/imageService";
import { benefits } from "../constants";
import { Upload, Image as ImageIcon, Plus, X, CloudCog } from "lucide-react";
import bgImage from "../assets/sign_inout/bg1.png";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [images, setImages] = useState([]); // Restored the images state
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Use useEffect to fetch images when component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await imageService.getAllImages();
        setImages(data.pictures || []); // Store the fetched images in state
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);
  
  console.log("Current user:", currentUser);
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      console.log("Uploading file:", file.name, file.type, file.size);

      const response = await imageService.uploadImage(file);
      console.log("Upload response:", response);

      // Fetch images again after upload
      const data = await imageService.getAllImages();
      setImages(data.pictures || []);

      setUploadModalOpen(false);
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const openPreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewModalOpen(true);
  };

  return (
    <div
      className="min-h-screen -m-2 text-white bg-cover mt-19"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <main className="container mx-auto p-6">
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-aroundwlkz-items-center">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="bg-gradient-to-br from-n-8 to-n-6 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-700"
              >
                <div className="p-5 flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                    {benefit.iconUrl && (
                      <img
                        src={benefit.iconUrl}
                        alt={benefit.title}
                        className="w-6 h-6"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{benefit.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
              Your Images
            </h2>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <Plus size={16} />
              <span>Add New</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => {
                return (
                  <div key={image._id} className="group relative">
                    <div className="rounded-lg overflow-hidden bg-gray-800 aspect-square relative">
                      <img
                        src={image.url}
                        alt={image.name || "Image"}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white font-medium truncate">
                          {image.name || "Untitled"}
                        </h3>
                        <div className="flex space-x-2 mt-2">
                          <Link
                            to={`/editor/${image._id}`} // Added 'to' prop (assuming you want it to link somewhere)
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => openPreview(image.url)}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-10 text-center">
              <div className="flex justify-center mb-4">
                <ImageIcon size={48} className="text-gray-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">No images yet</h3>
              <p className="text-gray-400 mb-6">
                Upload your first image to get started
              </p>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg transition-all duration-300 ease-in-out"
              >
                Upload an Image
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Modal code remains the same */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Upload Image</h2>

            {uploadError && (
              <div className="bg-red-900 bg-opacity-30 border border-red-800 text-red-200 px-4 py-2 rounded-md mb-4">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Select Image</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-400">
                      Click to browse or drag and drop
                    </p>
                    {file && (
                      <p className="mt-2 text-blue-400 font-medium">
                        {file.name}
                      </p>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setUploadModalOpen(false);
                    setFile(null);
                    setUploadError(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!file || uploading}
                  className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ${
                    !file || uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewModalOpen && previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-6xl w-full max-h-[90vh]">
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <X size={24} />
            </button>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={previewImage}
                alt="Full preview"
                className="w-full h-full object-contain max-h-[80vh]"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
