import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Package,
  Heart,
  ArrowLeft,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Users,
  Phone,
  Mail,
  Share2,
} from "lucide-react";
import { getFoodDetailsWithRequests, requestFood } from "@/api/userApi";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

function FoodDetails() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [foodDetails, setFoodDetails] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (foodId) {
      fetchFoodDetails();
    }
  }, [foodId]);

  const fetchFoodDetails = async () => {
    try {
      setLoading(true);
      const data = await getFoodDetailsWithRequests(foodId);
      setFoodDetails(data.food);
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching food details:", error);
      toast.error("Failed to load food details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFood = async () => {
    if (!currentUser) {
      toast.error("Please log in to request food");
      return;
    }

    if (requesting || hasUserRequested() || isFoodUnavailable()) {
      return;
    }

    try {
      setRequesting(true);
      await requestFood(foodId);
      toast.success("Food request submitted successfully!");
      await fetchFoodDetails(); // Refresh to show updated status
    } catch (error) {
      console.error("Error requesting food:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to request food. Please try again.";
      toast.error(errorMessage);
    } finally {
      setRequesting(false);
    }
  };

  const isFoodUnavailable = () => {
    if (!requests || !Array.isArray(requests)) return false;
    const hasApprovedRequest = requests.some(
      (request) => request.status === "approved",
    );
    // Debug log to see the request data
    console.log("Checking food availability:", {
      requests,
      hasApprovedRequest,
    });
    return hasApprovedRequest;
  };

  const hasUserRequested = () => {
    if (!requests || !Array.isArray(requests) || !currentUser) return false;
    return requests.some(
      (request) =>
        request.requestedBy === currentUser.uid &&
        (request.status === "pending" || request.status === "approved"),
    );
  };

  const getUserRequestStatus = () => {
    if (!requests || !Array.isArray(requests) || !currentUser) return null;
    const userRequest = requests.find(
      (request) => request.requestedBy === currentUser.uid,
    );
    return userRequest ? userRequest.status : null;
  };

  const formatExpiryDateTime = (expiryDate, expiryTime) => {
    try {
      if (!expiryDate) return "No expiry date specified";
      const dateTimeString = expiryTime
        ? `${expiryDate}T${expiryTime}`
        : expiryDate;
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleString();
    } catch (error) {
      return expiryTime ? `${expiryDate} ${expiryTime}` : expiryDate;
    }
  };

  const isExpiringSoon = (expiryDate, expiryTime) => {
    try {
      if (!expiryDate) return false;
      const dateTimeString = expiryTime
        ? `${expiryDate}T${expiryTime}`
        : expiryDate;
      const expiryDateTime = new Date(dateTimeString);
      const now = new Date();
      const hoursUntilExpiry = (expiryDateTime - now) / (1000 * 60 * 60);
      return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
    } catch (error) {
      return false;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: foodDetails?.food?.name || "Food Donation",
          text: `Check out this food donation: ${foodDetails?.food?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading food details...</p>
        </div>
      </div>
    );
  }

  if (!foodDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Food not found
          </h2>
          <p className="text-gray-500 mb-6">
            The food item you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate("/find-food")}
            className="bg-green-600 hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Find Food
          </Button>
        </div>
      </div>
    );
  }

  if (!foodDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-600 text-lg">Food details not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/find-food")}
          variant="outline"
          className="mb-6 hover:bg-green-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Find Food
        </Button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Hero Section with Image */}
          <div className="relative h-80 md:h-96 bg-gray-200">
            {foodDetails.image ? (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                )}
                <img
                  src={foodDetails.image}
                  alt={foodDetails.foodName}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-400" />
              </div>
            )}

            {/* Status Badges */}
            <div className="absolute top-4 left-4">
              <div
                className={`px-3 py-2 rounded-full text-sm font-medium shadow-lg ${
                  isFoodUnavailable()
                    ? "bg-red-500 text-white"
                    : hasUserRequested()
                      ? getUserRequestStatus() === "approved"
                        ? "bg-blue-500 text-white"
                        : "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                }`}
              >
                {isFoodUnavailable()
                  ? "Unavailable"
                  : hasUserRequested()
                    ? getUserRequestStatus() === "approved"
                      ? "Your Request Approved"
                      : "Your Request Pending"
                    : "Available"}
              </div>
            </div>

            {/* Expiry Warning */}
            {isExpiringSoon(foodDetails.expiryDate, foodDetails.expiryTime) && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg">
                Expires Soon!
              </div>
            )}

            {/* Food Taken Banner - More prominent when unavailable */}
            {isFoodUnavailable() && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                <div className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-xl transform rotate-12">
                  <div className="text-2xl font-bold text-center">
                    FOOD TAKEN
                  </div>
                  <div className="text-sm text-center mt-1 opacity-90">
                    This food has been claimed
                  </div>
                </div>
              </div>
            )}

            {/* Share Button */}
            <div className="absolute bottom-4 right-4">
              <Button
                onClick={handleShare}
                size="sm"
                variant="outline"
                className="bg-white/90 hover:bg-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {foodDetails.foodName || "Unknown Food"}
                  </h1>
                  <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                </div>

                <div className="prose max-w-none mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {console.log(foodDetails)}
                    {foodDetails.foodDescription ||
                      "No description available for this food item."}
                  </p>
                </div>

                {/* Request Information */}
                {requests.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Request Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center text-gray-600 mb-2">
                        <Users className="w-5 h-5 mr-2" />
                        <span>
                          {requests.length} request
                          {requests.length === 1 ? "" : "s"} received
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Status:{" "}
                        {requests.some((r) => r.status === "approved")
                          ? "Approved request exists"
                          : "All requests pending"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                  {/* Location */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Location
                    </h4>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>
                        {foodDetails.location || "Location not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Expires
                    </h4>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>
                        {formatExpiryDateTime(
                          foodDetails.expiryDate,
                          foodDetails.expiryTime,
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Donor Information - Note: donorName not available in current API response */}
                  {/* {foodDetails.donorName && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Donated By
                      </h4>
                      <div className="flex items-center text-gray-600">
                        <User className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span>{foodDetails.donorName}</span>
                      </div>
                    </div>
                  )} */}

                  {/* Posted Date */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Posted</h4>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>
                        {foodDetails.createdAt
                          ? new Date(foodDetails.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Request Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={handleRequestFood}
                      disabled={
                        requesting || isFoodUnavailable() || hasUserRequested()
                      }
                      className={`w-full py-3 font-medium rounded-lg transition-colors duration-200 ${
                        isFoodUnavailable()
                          ? "bg-red-600 hover:bg-red-700 text-white cursor-default"
                          : hasUserRequested()
                            ? "bg-blue-600 hover:bg-blue-700 text-white cursor-default"
                            : "bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white"
                      }`}
                    >
                      {requesting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Requesting...
                        </>
                      ) : isFoodUnavailable() ? (
                        <>
                          <XCircle className="w-5 h-5 mr-2" />
                          Unavailable
                        </>
                      ) : hasUserRequested() ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          {getUserRequestStatus() === "approved"
                            ? "Request Approved"
                            : "Request Pending"}
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5 mr-2" />
                          Request Food
                        </>
                      )}
                    </Button>

                    {!currentUser && (
                      <p className="text-sm text-gray-500 text-center mt-3">
                        Please log in to request food
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;
