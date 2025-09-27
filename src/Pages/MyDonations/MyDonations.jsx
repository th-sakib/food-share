import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Package,
  Heart,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  ChevronDown,
  RefreshCw,
  Eye,
} from "lucide-react";
import {
  getDonatedFoods,
  updateRequestStatus,
  getFoodRequests,
} from "@/api/userApi";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyDonations() {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [donatedFoods, setDonatedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(new Map());

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        navigate("/login", {
          state: {
            from: "/my-donations",
            message: "Please log in to view your donations",
          },
        });
      } else {
        fetchDonatedFoods();
      }
    }
  }, [currentUser, authLoading, navigate]);

  const fetchDonatedFoods = async () => {
    try {
      setLoading(true);
      const data = await getDonatedFoods();
      const foods = data.donations || data || [];

      // Fetch request data for each food item using /api/food/:foodId/request
      const foodsWithRequests = await Promise.all(
        foods.map(async (food) => {
          try {
            // Call /api/food/:foodId/request to get request data for this food
            const requestData = await getFoodRequests(food._id);

            // Check if the API response includes food data or just requests
            const hasRequests =
              requestData &&
              (Array.isArray(requestData) || requestData.requests);

            return {
              ...food,
              requests: Array.isArray(requestData)
                ? requestData
                : requestData.requests || [],
              // Store additional data if the endpoint returns food info
              requestApiData: requestData,
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
              requestApiData: null,
            };
          }
        }),
      );

      setDonatedFoods(foodsWithRequests);
    } catch (error) {
      console.error("Error fetching donated foods:", error);
      toast.error("Failed to load your donations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus, foodTitle) => {
    if (updatingStatus.has(requestId)) {
      return; // Prevent multiple simultaneous updates
    }

    try {
      setUpdatingStatus((prev) => new Set([...prev, requestId]));
      await updateRequestStatus(requestId, newStatus);

      toast.success(`Request ${newStatus} successfully for "${foodTitle}"`);

      // Refresh the data to show updated status
      await fetchDonatedFoods();

      // Close dropdown
      setDropdownOpen((prev) => {
        const newMap = new Map(prev);
        newMap.delete(requestId);
        return newMap;
      });
    } catch (error) {
      console.error("Error updating request status:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update request status. Please try again.";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const toggleDropdown = (requestId) => {
    setDropdownOpen((prev) => {
      const newMap = new Map(prev);
      if (newMap.get(requestId)) {
        newMap.delete(requestId);
      } else {
        newMap.set(requestId, true);
      }
      return newMap;
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "approved":
        return `${baseClass} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClass} bg-red-100 text-red-800`;
      case "pending":
      default:
        return `${baseClass} bg-yellow-100 text-yellow-800`;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Unknown date";
    }
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your donations...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Donations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your food donations and review requests from community
            members
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={fetchDonatedFoods}
            variant="outline"
            className="hover:bg-green-50"
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            You have donated{" "}
            <span className="font-semibold">{donatedFoods.length}</span> food
            item{donatedFoods.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Donations List */}
        {donatedFoods.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No donations found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't made any food donations yet. Start sharing food with
              your community!
            </p>
            <Button
              onClick={() => navigate("/donate-food")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Heart className="w-4 h-4 mr-2" />
              Donate Food
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {donatedFoods.map((donation) => (
              <div
                key={donation._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Food Image */}
                    <div className="lg:w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {donation.image ? (
                        <img
                          src={donation.image}
                          alt={donation.foodName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentNode.querySelector(
                              ".fallback-icon",
                            ).style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`fallback-icon w-full h-full ${donation.imageUrl ? "hidden" : "flex"} items-center justify-center`}
                      >
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>

                    {/* Food Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {donation.foodName || "Unknown Food"}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {donation.foodDescription ||
                              "No description available"}
                          </p>
                        </div>
                        <Button
                          onClick={() => navigate(`/food/${donation._id}`)}
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>

                      {/* Food Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            {donation.location || "Location not specified"}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            Expires:{" "}
                            {formatExpiryDateTime(
                              donation.expiryDate,
                              donation.expiryTime,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            Donated: {formatDate(donation.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Requests Section */}
                      {donation.requests && donation.requests.length > 0 ? (
                        <div>
                          <div className="flex items-center mb-4">
                            <Users className="w-5 h-5 mr-2 text-green-600" />
                            <h4 className="text-lg font-semibold text-gray-800">
                              Requests ({donation.requests.length})
                            </h4>
                          </div>

                          {/* Request Status Summary */}
                          <div className="flex items-center space-x-2 mb-4 text-sm">
                            {(() => {
                              const statusCounts = donation.requests.reduce(
                                (acc, req) => {
                                  acc[req.status || "pending"] =
                                    (acc[req.status || "pending"] || 0) + 1;
                                  return acc;
                                },
                                {},
                              );
                              return (
                                <>
                                  {statusCounts.pending > 0 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                      {statusCounts.pending} Pending
                                    </span>
                                  )}
                                  {statusCounts.approved > 0 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                      {statusCounts.approved} Approved
                                    </span>
                                  )}
                                  {statusCounts.rejected > 0 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                      {statusCounts.rejected} Rejected
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                          <div className="space-y-3">
                            {donation.requests.map((request) => (
                              <div
                                key={request._id}
                                className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                      {request.requestedBy?.name ||
                                        request.requestedBy?.displayName ||
                                        request.requesterName ||
                                        "Anonymous User"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      {formatDate(request.createdAt)}
                                    </span>
                                  </div>
                                  <div
                                    className={getStatusBadge(request.status)}
                                  >
                                    {request.status || "pending"}
                                  </div>
                                </div>

                                {/* Status Update Dropdown */}
                                <div className="relative">
                                  <Button
                                    onClick={() => toggleDropdown(request._id)}
                                    variant="outline"
                                    size="sm"
                                    disabled={updatingStatus.has(request._id)}
                                    className="flex items-center space-x-2"
                                  >
                                    {updatingStatus.has(request._id) ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                                    ) : (
                                      <>
                                        {getStatusIcon(request.status)}
                                        <span className="text-sm">
                                          Update Status
                                        </span>
                                        <ChevronDown className="w-4 h-4" />
                                      </>
                                    )}
                                  </Button>

                                  {/* Dropdown Menu */}
                                  {dropdownOpen.get(request._id) && (
                                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                      <div className="py-1">
                                        {[
                                          "pending",
                                          "approved",
                                          "rejected",
                                        ].map((status) => (
                                          <button
                                            key={status}
                                            onClick={() =>
                                              handleStatusUpdate(
                                                request._id,
                                                status,
                                                donation.foodName,
                                              )
                                            }
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                                              request.status === status
                                                ? "bg-green-50 text-green-700"
                                                : "text-gray-700"
                                            }`}
                                            disabled={updatingStatus.has(
                                              request._id,
                                            )}
                                          >
                                            {getStatusIcon(status)}
                                            <span className="capitalize">
                                              {status}
                                            </span>
                                            {request.status === status && (
                                              <CheckCircle className="w-3 h-3 ml-auto text-green-600" />
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                          <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No requests yet</p>
                          <p className="text-sm text-gray-400">
                            Your food donation is waiting for requests from the
                            community
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {dropdownOpen.size > 0 && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setDropdownOpen(new Map())}
        ></div>
      )}
    </div>
  );
}

export default MyDonations;
