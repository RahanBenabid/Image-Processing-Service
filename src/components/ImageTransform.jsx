import React, { useState, useEffect, useMemo } from "react";
import transformService from "../services/transformService";
import {
  Sliders,
  Crop,
  RotateCw,
  RefreshCw,
  FileImage,
  Image,
  Palette,
  Type,
} from "lucide-react";
import { saveAs } from "file-saver";
import imageService from "../services/imageService";

const ImageTransform = ({
  imageId,
  onTransformComplete,
  onParamsChange,
  previewImageUrl,
  onPreviewChange,
}) => {
  const [activeTab, setActiveTab] = useState("resize");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState(null)
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  useEffect(() => {
    if (!imageId) return;

    const fetchImage = async () => {
      try {
        setLoading(true);
        const imageData = await imageService.getImageById(imageId);
        setImage(imageData.picture);
        setOriginalImage(imageData.picture); 
        setError(null);
      } catch (err) {
        console.error("Failed to fetch image:", err);
        setError("Failed to load image. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [imageId]);
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
  // Track all active transformations instead of just the current tab
  const [transformParams, setTransformParams] = useState({
    resize: { width: 800, height: 600, maintainAspectRatio: true },
    crop: { x: 0, y: 0, width: 500, height: 500 },
    rotate: { degrees: 90 },
    flip: { direction: "horizontal" },
    filters: {
      blackAndWhite: false,
      sepia: false,
      invert: false,
      brightness: 0,
      contrast: 0,
      blur: 0,
      sharpen: 0,
    },
    compress: { percentage: 80 },
    convert: { format: "jpeg" },
    watermark: { text: "Watermark", position: "bottom-right" },
  });

  // Track which transformations are enabled
  const [activeTransformations, setActiveTransformations] = useState({
    resize: false,
    crop: false,
    rotate: false,
    flip: false,
    filters: false,
    compress: false,
    convert: false,
    watermark: false,
  });

  // Prepare active transformations for backend
  const prepareActiveTransformations = useMemo(() => {
    const activeParams = {};
    Object.keys(activeTransformations).forEach((key) => {
      if (activeTransformations[key]) {
        if (key === "filters") {

          const activeFilters = {};
          const filters = transformParams.filters;
          if (filters.blackAndWhite) activeFilters.blackAndWhite = true;
          if (filters.sepia) activeFilters.sepia = true;
          if (filters.invert) activeFilters.invert = true;
          if (filters.sharpen > 0) activeFilters.sharpen = filters.sharpen;
          if (filters.brightness > 0)
            activeFilters.brightness = filters.brightness;
          if (filters.contrast > 0) activeFilters.contrast = filters.contrast;
          if (filters.blur > 0) activeFilters.blur = filters.blur;

          if (Object.keys(activeFilters).length > 0) {
            activeParams.filters = activeFilters;
          }
        } else {
          const convertedParams = { ...transformParams[key] };
          if (key === "resize" && "maintainAspectRatio" in convertedParams) {
            convertedParams.maintain_aspect_ratio =
              convertedParams.maintainAspectRatio;
            delete convertedParams.maintainAspectRatio;
          }
          activeParams[key] = convertedParams;
        }
      }
    });

    return activeParams;
  }, [transformParams, activeTransformations]);

  useEffect(() => {
    if (
      onParamsChange &&
      Object.keys(prepareActiveTransformations).length > 0
    ) {
      onParamsChange(prepareActiveTransformations);
    }
  }, [prepareActiveTransformations, onParamsChange]);

  const handlePreviewTransform = async () => {
  if (!imageId || !prepareActiveTransformations) {
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
    const changesJson = JSON.stringify(prepareActiveTransformations);
    formData.append("changes", changesJson);

    console.log("Sending preview request with params:", prepareActiveTransformations);
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
    if (onPreviewChange) {
      onPreviewChange(previewUrl);
    }
  } catch (error) {
    console.error("Preview transform error:", error);
    setError("Failed to preview transformation: " + error.message);
  } finally {
    setPreviewLoading(false);
  }
};

  const transformImage = async () => {
    try {
      if (!imageId) {
        console.error("No image to transform");
        setError("No image selected for transformation");
        return null;
      }
  
      if (Object.keys(prepareActiveTransformations).length === 0) {
        console.error("No transformation parameters selected");
        setError("Please select at least one transformation before proceeding");
        return null;
      }
      setIsProcessing(true);
      setError(null);
      const formData = new FormData();
      const imageBlob = await fetchImageAsBlob(originalImage.url);
      formData.append(
        "picture",
        imageBlob,
        originalImage.metadata?.fileName || "image.jpg"
      );
      const changesJson = JSON.stringify(prepareActiveTransformations);
      formData.append("changes", changesJson);

      const response = await fetch(
        `http://localhost:3000/api/images/${imageId}/transform`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ changes: prepareActiveTransformations }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! Status: ${response.status}`
        );
      }
  
      const data = await response.json();
      console.log('hooooy', data.publicUrl)
      if (data.publicUrl) {
        setPreviewImage(data.publicUrl);
        const originalName = originalImage.metadata?.fileName || "image";
        const basename = originalName.split('.')[0];
        const format = prepareActiveTransformations.convert?.format || originalName.split('.').pop() || 'jpg';
        const newFileName = `${basename}-transformed.${format}`;

        saveAs(data.publicUrl, newFileName);
        onTransformComplete();
        setSuccess("Image transformed and downloaded successfully!");
        return data.publicUrl;
      } else {
        console.warn("No publicUrl in response:", data);
        setError("Image transformed, but no public URL provided.");
        return null;
      }
    } catch (error) {
      console.error("Transform error:", error);
      setError(error.message || "Failed to transform image");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  // Toggle transformation on/off
  const toggleTransformation = (type) => {
    setActiveTransformations((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Update transformation parameters
  const updateParams = (type, key, value) => {
    setTransformParams((prev) => ({
      ...prev,
      [type]: { ...prev[type], [key]: value },
    }));
    if (!activeTransformations[type]) {
      setActiveTransformations((prev) => ({
        ...prev,
        [type]: true,
      }));
    }
  };

  // Update filter parameters specifically
  const updateFilterParams = (filter, value) => {
    setTransformParams((prev) => ({
      ...prev,
      filters: { ...prev.filters, [filter]: value },
    }));

    if (!activeTransformations.filters) {
      setActiveTransformations((prev) => ({
        ...prev,
        filters: true,
      }));
    }
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    const params = transformParams[activeTab];
    const isActive = activeTransformations[activeTab];

    const icons = {
      resize: <Sliders size={18} className="text-blue-400" />,
      crop: <Crop size={18} className="text-purple-400" />,
      rotate: <RotateCw size={18} className="text-pink-400" />,
      flip: <RefreshCw size={18} className="text-green-400" />,
      filters: <Palette size={18} className="text-yellow-400" />,
      compress: <FileImage size={18} className="text-red-400" />,
      convert: <Image size={18} className="text-indigo-400" />,
      watermark: <Type size={18} className="text-teal-400" />,
    };

    const tabConfig = {
      resize: {
        inputs: [
          {
            label: "Width (px)",
            type: "number",
            value: params.width,
            onChange: (e) =>
              updateParams("resize", "width", parseInt(e.target.value) || 0),
          },
          {
            label: "Height (px)",
            type: "number",
            value: params.height,
            onChange: (e) =>
              updateParams("resize", "height", parseInt(e.target.value) || 0),
          },
          // {
          //   label: "Maintain aspect ratio",
          //   type: "checkbox",
          //   checked: params.maintainAspectRatio,
          //   onChange: (e) =>
          //     updateParams("resize", "maintainAspectRatio", e.target.checked),
          // },
        ],
      },
      crop: {
        inputs: [
          {
            label: "X Position",
            type: "number",
            value: params.x,
            onChange: (e) =>
              updateParams("crop", "x", parseInt(e.target.value) || 0),
          },
          {
            label: "Y Position",
            type: "number",
            value: params.y,
            onChange: (e) =>
              updateParams("crop", "y", parseInt(e.target.value) || 0),
          },
          {
            label: "Width",
            type: "number",
            value: params.width,
            onChange: (e) =>
              updateParams("crop", "width", parseInt(e.target.value) || 0),
          },
          {
            label: "Height",
            type: "number",
            value: params.height,
            onChange: (e) =>
              updateParams("crop", "height", parseInt(e.target.value) || 0),
          },
        ],
      },
      rotate: {
        options: [90, 180, 270].map((deg) => ({
          label: `${deg}°`,
          active: params.degrees === deg,
          onClick: () => updateParams("rotate", "degrees", deg),
        })),
      },
      flip: {
        options: [
          {
            label: "Horizontal",
            icon: <RefreshCw size={20} className="rotate-90" />,
            active: params.direction === "horizontal",
            onClick: () => updateParams("flip", "direction", "horizontal"),
          },
          {
            label: "Vertical",
            icon: <RefreshCw size={20} />,
            active: params.direction === "vertical",
            onClick: () => updateParams("flip", "direction", "vertical"),
          },
          {
            label: "both",
            icon: <RefreshCw size={20} className="rotate-90" />,
            active: params.direction === "both",
            onClick: () => updateParams("flip", "direction", "both"),
          },
        ],
      },
      filters: {
        options: [
          {
            label: "Black & White",
            active: transformParams.filters.blackAndWhite,
            onClick: () =>
              updateFilterParams(
                "blackAndWhite",
                !transformParams.filters.blackAndWhite,
              ),
          },
          {
            label: "Sepia",
            active: transformParams.filters.sepia,
            onClick: () =>
              updateFilterParams("sepia", !transformParams.filters.sepia),
          },
          {
            label: "Invert",
            active: transformParams.filters.invert,
            onClick: () =>
              updateFilterParams("invert", !transformParams.filters.invert),
          },
        ],
        inputs: [
          {
            label: `Blur: ${transformParams.filters.blur}`,
            type: "range",
            min: 0,
            max: 100,
            value: transformParams.filters.blur,
            onChange: (e) =>
              updateFilterParams("blur", parseInt(e.target.value)),
          },
          {
            label: `Brightness: ${transformParams.filters.brightness}`,
            type: "range",
            min: 0,
            max: 5,
            value: transformParams.filters.brightness,
            onChange: (e) =>
              updateFilterParams("brightness", parseInt(e.target.value)),
          },
          {
            label: `Sharpen: ${transformParams.filters.sharpen}`,
            type: "range",
            min: 0,
            max: 10,
            value: transformParams.filters.sharpen,
            onChange: (e) =>
              updateFilterParams("sharpen", parseInt(e.target.value)),
          },
          {
            label: `Contrast: ${transformParams.filters.contrast}`,
            type: "range",
            min: 0,
            max: 5,
            value: transformParams.filters.contrast,
            onChange: (e) =>
              updateFilterParams("contrast", parseInt(e.target.value)),
          },
        ],
      },
      compress: {
        inputs: [
          {
            label: `Percentage: ${params.percentage}%`,
            type: "range",
            min: 10,
            max: 100,
            value: params.percentage,
            onChange: (e) =>
              updateParams("compress", "percentage", parseInt(e.target.value)),
          },
        ],
      },
      convert: {
        options: ["jpeg", "png", "webp", "bmp"].map((format) => ({
          label: format.toUpperCase(),
          active: params.format === format,
          onClick: () => updateParams("convert", "format", format),
        })),
      },
      watermark: {
        inputs: [
          {
            label: "Watermark Text",
            type: "text",
            value: params.text,
            onChange: (e) => updateParams("watermark", "text", e.target.value),
          },
          {
            label: "Position",
            type: "select",
            value: params.position,
            options: [
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "center",
            ],
            onChange: (e) =>
              updateParams("watermark", "position", e.target.value),
          },
        ],
      },
    };

    return (
      <div className="p-6 bg-n-7 rounded-b-xl border-t border-n-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {icons[activeTab]}
            <h3 className="text-xl font-semibold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              {activeTab === "filters"
                ? "Filters"
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
              Settings
            </h3>
          </div>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => toggleTransformation(activeTab)}
              className="sr-only peer"
            />
            <div
              className="relative w-11 h-6 bg-n-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[
              2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
            ></div>
            <span className="ms-3 text-sm font-medium text-gray-300">
              {isActive ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>

        <div className="space-y-6">
          {tabConfig[activeTab].inputs?.map((input, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm text-n-3">{input.label}</label>
              {input.type === "checkbox" ? (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={input.checked}
                    onChange={input.onChange}
                    className="form-checkbox h-5 w-5 text-blue-500 rounded border-n-5 bg-n-6 focus:ring-blue-500"
                  />
                  <span className="text-n-2">{input.label}</span>
                </label>
              ) : input.type === "select" ? (
                <select
                  value={input.value}
                  onChange={input.onChange}
                  className="w-full bg-n-6 border border-n-5 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                >
                  {input.options.map((option) => (
                    <option key={option} value={option}>
                      {option
                        .split("-")
                        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                        .join(" ")}
                    </option>
                  ))}
                </select>
              ) : input.type === "range" ? (
                <>
                  <input
                    type="range"
                    min={input.min}
                    max={input.max}
                    value={input.value}
                    onChange={input.onChange}
                    className="w-full h-2 bg-n-6 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-600"
                  />
                </>
              ) : (
                <input
                  type={input.type}
                  value={input.value}
                  onChange={input.onChange}
                  className="w-full bg-n-6 border border-n-5 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                />
              )}
            </div>
          ))}

          {tabConfig[activeTab].options && (
            <div
              className={`grid gap-3 ${
                activeTab === "rotate"
                  ? "grid-cols-3"
                  : activeTab === "flip"
                    ? "grid-cols-2"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
              }`}
            >
              {tabConfig[activeTab].options.map((option, index) => (
                <button
                  key={index}
                  onClick={option.onClick}
                  className={`py-3 px-4 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${
                    option.active
                      ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10"
                      : "bg-n-6 border-n-5 hover:bg-n-5"
                  }`}
                >
                  {option.icon && <span className="mb-2">{option.icon}</span>}
                  <span
                    className={`font-medium ${
                      option.active ? "text-blue-400" : "text-n-2"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-n-6">
            <div className="flex flex-col gap-3">
              <div className="text-center text-xs text-gray-400 mb-2">
                {Object.entries(activeTransformations).filter(
                  ([_, isActive]) => isActive,
                ).length === 0 ? (
                  <span>No transformations selected</span>
                ) : (
                  <span>
                    Active transformations:{" "}
                    {Object.entries(activeTransformations)
                      .filter(([_, isActive]) => isActive)
                      .map(
                        ([key]) => key.charAt(0).toUpperCase() + key.slice(1),
                      )
                      .join(", ")}
                  </span>
                )}
              </div>

              <button
                onClick={handlePreviewTransform}
                disabled={
                  isProcessing ||
                  Object.values(activeTransformations).every((v) => !v)
                }
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                  isProcessing ||
                  Object.values(activeTransformations).every((v) => !v)
                    ? "bg-n-6 text-n-3 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-purple-500/20"
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Preview Changes"
                )}
              </button>

              <button
                onClick={transformImage}
                disabled={
                  isProcessing ||
                  Object.values(activeTransformations).every((v) => !v)
                }
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                  isProcessing ||
                  Object.values(activeTransformations).every((v) => !v)
                    ? "bg-n-6 text-n-3 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/20"
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Transform & Download"
                )}
              </button>
            </div>

            {/* Preview Image Display */}
            {previewUrl && (
              <div className="mt-6 border border-n-5 rounded-lg overflow-hidden">
                <div className="bg-n-6 p-3 text-sm text-n-3 border-b border-n-5">
                  Preview of Transformations
                </div>
                <img
                  src={previewUrl}
                  alt="Transformed Preview"
                  className="w-full max-h-[400px] object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-n-8 rounded-xl overflow-hidden border border-n-6">
      {/* Error Handling */}
      {error && (
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4">
          <p className="text-red-300 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Success Handling */}
      {success && (
        <div className="bg-green-900/30 border-l-4 border-green-500 p-4">
          <p className="text-green-300 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-1 bg-n-7 p-1">
        {[
          "resize",
          "crop",
          "rotate",
          "flip",
          "filters",
          "compress",
          "convert",
          "watermark",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 flex flex-col items-center justify-center text-xs rounded-lg transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-blue-400 shadow-inner"
                : activeTransformations[tab]
                  ? "text-green-400 bg-green-900/20"
                  : "text-n-3 hover:text-n-1 hover:bg-n-6"
            }`}
          >
            {
              {
                resize: <Sliders size={16} className="mb-1" />,
                crop: <Crop size={16} className="mb-1" />,
                rotate: <RotateCw size={16} className="mb-1" />,
                flip: <RefreshCw size={16} className="mb-1" />,
                filters: <Palette size={16} className="mb-1" />,
                compress: <FileImage size={16} className="mb-1" />,
                convert: <Image size={16} className="mb-1" />,
                watermark: <Type size={16} className="mb-1" />,
              }[tab]
            }
            <span>
              {tab === "filters"
                ? "Filters"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
          </button>
        ))}
      </div>

      {/* Render Tab Content */}
      {renderTabContent()}
    </div>
  );
};
export default ImageTransform;
