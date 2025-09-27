import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Package,
  Heart,
  Search,
  Filter,
  Calendar,
  User,
  RefreshCw,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";
import { getFoodDonations, requestFood, getFoodRequests } from "@/api/userApi";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

function FindFood() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [requestingIds, setRequestingIds] = useState(new Set());

  // Fetch food donations on component mount
  useEffect(() => {
    fetchFoodDonations();
  }, []);

  // Filter food items based on search term and location
  useEffect(() => {
    let filtered = foodItems;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.foodName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.foodDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((item) =>
        item.location?.toLowerCase().includes(locationFilter.toLowerCase()),
      );
    }

    setFilteredItems(filtered);
  }, [foodItems, searchTerm, locationFilter]);

  // Helper function to check if food has approved requests (unavailable)
  const isFoodUnavailable = (food) => {
    if (!food.requests || !Array.isArray(food.requests)) return false;
    return food.requests.some((request) => request.status === "approved");
  };

  // Helper function to check if current user has already requested this food
  const hasUserRequested = (food) => {
    if (!food.requests || !Array.isArray(food.requests) || !currentUser)
      return false;
    return food.requests.some(
      (request) =>
        request.requestedBy === currentUser.uid &&
        (request.status === "pending" || request.status === "approved"),
    );
  };

  // Helper function to get request status for current user
  const getUserRequestStatus = (food) => {
    if (!food.requests || !Array.isArray(food.requests) || !currentUser)
      return null;
    const userRequest = food.requests.find(
      (request) => request.requestedBy === currentUser.uid,
    );
    return userRequest ? userRequest.status : null;
  };

  const fetchFoodDonations = async () => {
    try {
      setLoading(true);
      const data = await getFoodDonations();
      // Handle different response structures
      const donations = data.donations || data.data || data || [];

      // Fetch request data for each food item to get proper availability status
      const foodsWithRequests = await Promise.all(
        donations.map(async (food) => {
          try {
            // Call /api/food/:foodId/request to get request data for this food
            const requestData = await getFoodRequests(food._id);

            return {
              ...food,
              requests: Array.isArray(requestData)
                ? requestData
                : requestData.requests || [],
            };
          } catch (error) {
            console.error(
              `Error fetching requests for food ${food._id}:`,
              error,
            );
            // If request fails, keep the food without request data
            return {
              ...food,
              requests: [],
            };
          }
        }),
      );

      setFoodItems(Array.isArray(foodsWithRequests) ? foodsWithRequests : []);
    } catch (error) {
      console.error("Error fetching food donations:", error);
      toast.error("Failed to load food donations. Please try again.");
      setFoodItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFood = async (foodId) => {
    if (!currentUser) {
      toast.error("Please log in to request food");
      return;
    }

    if (requestingIds.has(foodId)) {
      return; // Prevent multiple simultaneous requests
    }

    try {
      setRequestingIds(new Set([...requestingIds, foodId]));
      const response = await requestFood(foodId);

      toast.success("Food request submitted successfully!");
      console.log("Food request created:", response);

      // Refresh the food list to get updated request status
      await fetchFoodDonations();
    } catch (error) {
      console.error("Error requesting food:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to request food. Please try again.";
      toast.error(errorMessage);
    } finally {
      setRequestingIds(
        new Set([...requestingIds].filter((id) => id !== foodId)),
      );
    }
  };

  // Handle clicking on food card to navigate to details
  const handleCardClick = (foodId) => {
    navigate(`/food/${foodId}`);
  };

  const formatExpiryDateTime = (expiryDate, expiryTime) => {
    try {
      if (!expiryDate) return "No expiry date";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading available food...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8 lg:mt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Search className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Food</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover available food donations in your area and help reduce food
            waste
          </p>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredItems.length}</span> of{" "}
            <span className="font-semibold">{foodItems.length}</span> available
            food donations
          </p>
        </div>

        {/* Food Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No food available
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {foodItems.length === 0
                ? "There are no food donations available at the moment. Check back later or be the first to donate!"
                : "No food matches your search criteria. Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((food) => (
              <div
                key={food._id || food.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => handleCardClick(food._id || food.id)}
              >
                {/* Food Image */}
                <div className="relative h-48 bg-gray-200">
                  {food.image ? (
                    <img
                      src={food.image}
                      alt={food.foodName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.querySelector(
                          ".fallback-icon",
                        ).style.display = "flex";
                      }}
                    />
                  ) : null}

                  {/* Expiry warning badge */}
                  {isExpiringSoon(food.expiryDate, food.expiryTime) && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                      Expires Soon!
                    </div>
                  )}

                  {/* Status badge */}
                  <div
                    className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
                      isFoodUnavailable(food)
                        ? "bg-red-500 text-white"
                        : hasUserRequested(food)
                          ? getUserRequestStatus(food) === "approved"
                            ? "bg-blue-500 text-white"
                            : "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"
                    }`}
                  >
                    {isFoodUnavailable(food)
                      ? "Unavailable"
                      : hasUserRequested(food)
                        ? getUserRequestStatus(food) === "approved"
                          ? "Approved"
                          : "Pending"
                        : "Available"}
                  </div>
                </div>

                {/* Food Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1 line-clamp-1">
                      {food.foodName || "Unknown Food"}
                    </h3>
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors flex-shrink-0 ml-2" />
                  </div>

                  <p
                    className="text-gray-600 mb-4 text-sm leading-relaxed"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {food.foodDescription || "No description available"}
                  </p>

                  {/* Location */}
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm truncate">
                      {food.location || "Location not specified"}
                    </span>
                  </div>

                  {/* Expiry Date */}
                  <div className="flex items-center text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      Expires:{" "}
                      {formatExpiryDateTime(food.expiryDate, food.expiryTime)}
                    </span>
                  </div>

                  {/* Donor info */}
                  {food.donorName && (
                    <div className="flex items-center text-gray-500 mb-2">
                      <User className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm truncate">
                        Donated by {food.donorName}
                      </span>
                    </div>
                  )}

                  {/* Request info */}
                  {food.requests && food.requests.length > 0 && (
                    <div className="flex items-center text-gray-500 mb-4">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        {food.requests.length} request
                        {food.requests.length === 1 ? "" : "s"}
                        {food.requests.some((r) => r.status === "approved") &&
                          " (approved)"}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(food._id || food.id);
                      }}
                      variant="outline"
                      className="flex-1 py-2.5 px-4 rounded-lg font-medium border-green-200 text-green-700 hover:bg-green-50"
                    >
                      View Details
                    </Button>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestFood(food._id || food.id);
                      }}
                      disabled={
                        requestingIds.has(food._id || food.id) ||
                        isFoodUnavailable(food) ||
                        hasUserRequested(food)
                      }
                      className={`flex-1 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                        isFoodUnavailable(food)
                          ? "bg-red-600 hover:bg-red-700 text-white cursor-default"
                          : hasUserRequested(food)
                            ? "bg-blue-600 hover:bg-blue-700 text-white cursor-default"
                            : "bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white"
                      }`}
                    >
                      {requestingIds.has(food._id || food.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Requesting...
                        </>
                      ) : isFoodUnavailable(food) ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Unavailable
                        </>
                      ) : hasUserRequested(food) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {getUserRequestStatus(food) === "approved"
                            ? "Approved"
                            : "Pending"}
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 mr-2" />
                          Request
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FindFood;
