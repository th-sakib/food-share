import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Calendar,
  MapPin,
  Package,
  Camera,
  X,
  FileText,
} from "lucide-react";
import { createFoodDonation } from "@/api/userApi";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

function DonateFood() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodName: "",
    foodDescription: "",
    expiryDate: "",
    expiryTime: "",
    location: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check authentication on component mount
  useEffect(() => {
    if (!loading && !currentUser) {
      // User is not authenticated, redirect to login
      navigate("/login", {
        state: {
          from: "/donate-food",
          message: "Please log in to donate food",
        },
      });
    }
  }, [currentUser, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render the form if user is not authenticated
  if (!currentUser) {
    return null;
  }

  // Function to generate unique filename
  const generateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split(".").pop();
    return `food-${timestamp}-${randomStr}.${extension}`;
  };

  // Function to extract public_id from Cloudinary URL
  const extractPublicIdFromUrl = (imageUrl) => {
    try {
      // Example URL: https://res.cloudinary.com/cloudname/image/upload/v1234567890/food-donations/food-1234567890-abc123.jpg
      const urlParts = imageUrl.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      if (uploadIndex === -1) return null;

      // Get everything after version (v1234567890/folder/filename)
      const pathAfterVersion = urlParts.slice(uploadIndex + 2).join("/");
      // Remove file extension
      const publicId = pathAfterVersion.replace(/\.[^/.]+$/, "");
      return publicId;
    } catch (error) {
      console.error("Error extracting public_id from URL:", error);
      return null;
    }
  };

  // Function to delete image from Cloudinary
  const deleteImageFromCloudinary = async (imageUrl) => {
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
      const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        console.warn("Cloudinary credentials missing for image deletion");
        return;
      }

      const publicId = extractPublicIdFromUrl(imageUrl);
      if (!publicId) {
        console.warn("Could not extract public_id from image URL");
        return;
      }

      // Create signature for authenticated request
      const timestamp = Math.round(new Date().getTime() / 1000);
      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

      // Note: For security reasons, image deletion should ideally be done on the backend
      // This is a simplified approach - consider moving this to your backend API
      console.log("Image deletion attempted for public_id:", publicId);

      // For now, we'll just log the deletion attempt
      // In production, you should implement this deletion on your backend
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  };

  // Function to upload image to Cloudinary
  const uploadImageToCloudinary = async (imageFile) => {
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error(
          "Cloudinary configuration is missing. Please check your environment variables.",
        );
      }

      const formData = new FormData();
      console.log(formData);
      formData.append("file", imageFile);
      formData.append("upload_preset", uploadPreset);
      formData.append("public_id", generateUniqueFileName(imageFile.name));
      formData.append("folder", "food-donations");
      console.log("formdata end: ", formData);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await response.json();
      return {
        secure_url: data.secure_url,
        public_id: data.public_id,
        fullData: data,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear image error
      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.foodName.trim()) {
      newErrors.foodName = "Food name is required";
    }

    if (!formData.foodDescription.trim()) {
      newErrors.foodDescription = "Food description is required";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else {
      const selectedDate = new Date(
        formData.expiryDate + " " + (formData.expiryTime || "00:00"),
      );
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.expiryDate = "Expiry date must be in the future";
      }
    }

    if (!formData.expiryTime) {
      newErrors.expiryTime = "Expiry time is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.image) {
      newErrors.image = "Food image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    let uploadedImageData = null;

    try {
      // Step 1: Upload image to Cloudinary
      let imageUrl = null;
      if (formData.image) {
        setUploadProgress(25);
        uploadedImageData = await uploadImageToCloudinary(formData.image);
        imageUrl = uploadedImageData.secure_url;
        setUploadProgress(50);
      }

      // Step 2: Prepare data for API submission
      const submissionData = {
        foodName: formData.foodName,
        foodDescription: formData.foodDescription,
        expiryDate: formData.expiryDate,
        expiryTime: formData.expiryTime,
        location: formData.location,
        imageUrl: imageUrl,
      };

      setUploadProgress(75);

      // Step 3: Submit to your backend API
      await createFoodDonation(submissionData);

      setUploadProgress(100);

      // Reset form on success
      setFormData({
        foodName: "",
        foodDescription: "",
        expiryDate: "",
        expiryTime: "",
        location: "",
        image: null,
      });
      setImagePreview(null);
      setErrors({});
      setUploadProgress(0);

      // Show success message
      if (toast) {
        toast.success("Food donation submitted successfully!");
      } else {
        alert("Food donation submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setUploadProgress(0);

      // If image was uploaded but API call failed, attempt to delete the image
      if (uploadedImageData && uploadedImageData.secure_url) {
        console.log("Attempting to clean up uploaded image due to error...");
        await deleteImageFromCloudinary(uploadedImageData.secure_url);
      }

      // Show error message
      const errorMessage =
        error.message || "Error submitting donation. Please try again.";
      if (toast) {
        toast.error(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Donate Food</h1>
          <p className="text-lg text-gray-600">
            Help reduce food waste by sharing surplus food with those in need
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Food Name */}
            <div>
              <label
                htmlFor="foodName"
                className="flex items-center text-sm font-semibold text-gray-700 mb-3"
              >
                <Package className="w-4 h-4 mr-2 text-green-600" />
                Food Name
              </label>
              <input
                type="text"
                id="foodName"
                name="foodName"
                value={formData.foodName}
                onChange={handleInputChange}
                placeholder="e.g., Homemade pasta, Fresh vegetables..."
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.foodName
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              />
              {errors.foodName && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {errors.foodName}
                </p>
              )}
            </div>
            {/* Food Description */}
            <div>
              <label
                htmlFor="foodDescription"
                className="flex items-center text-sm font-semibold text-gray-700 mb-3"
              >
                <FileText className="w-4 h-4 mr-2 text-green-600" />
                Food Description
              </label>
              <textarea
                id="foodDescription"
                name="foodDescription"
                value={formData.foodDescription}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your food item in detail... (e.g., ingredients, preparation method, allergens, portion size, etc.)"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                  errors.foodDescription
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              />
              {errors.foodDescription && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {errors.foodDescription}
                </p>
              )}
            </div>

            {/* Expiry Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="expiryDate"
                  className="flex items-center text-sm font-semibold text-gray-700 mb-3"
                >
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.expiryDate
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                {errors.expiryDate && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="expiryTime"
                  className="flex items-center text-sm font-semibold text-gray-700 mb-3"
                >
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  Expiry Time
                </label>
                <input
                  type="time"
                  id="expiryTime"
                  name="expiryTime"
                  value={formData.expiryTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.expiryTime
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                {errors.expiryTime && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {errors.expiryTime}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="flex items-center text-sm font-semibold text-gray-700 mb-3"
              >
                <MapPin className="w-4 h-4 mr-2 text-green-600" />
                Pickup Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Downtown, Main Street, City Center..."
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.location
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              />
              {errors.location && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Camera className="w-4 h-4 mr-2 text-green-600" />
                Food Image
              </label>

              {!imagePreview ? (
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 hover:border-green-400 ${
                    errors.image
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold text-green-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Food preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {errors.image && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {errors.image}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              {/* Progress bar for upload */}
              {isSubmitting && uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Upload Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {uploadProgress > 0 && uploadProgress < 25
                      ? "Uploading image..."
                      : uploadProgress >= 25 && uploadProgress < 75
                        ? "Processing..."
                        : uploadProgress >= 75
                          ? "Submitting..."
                          : "Please wait..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Package className="w-5 h-5 mr-2" />
                    Donate Food
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Tips for Better Donations
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Ensure food is fresh and safe for consumption</li>
            <li>
              • Provide detailed description with ingredients and allergens
            </li>
            <li>• Provide accurate expiry information</li>
            <li>• Include clear photos of the food</li>
            <li>• Mention any allergens or dietary information</li>
            <li>• Be available for pickup coordination</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DonateFood;
