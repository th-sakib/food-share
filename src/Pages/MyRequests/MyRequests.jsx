import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Eye,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { getUserRequests } from "@/api/userApi";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyRequests() {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        navigate("/login", {
          state: {
            from: "/my-requests",
            message: "Please log in to view your requests",
          },
        });
      } else {
        fetchMyRequests();
      }
    }
  }, [currentUser, authLoading, navigate]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const data = await getUserRequests();
      // Handle different response structures
      const userRequests = data.requests || data.data || data || [];
      setRequests(Array.isArray(userRequests) ? userRequests : []);
    } catch (error) {
      console.error("Error fetching my requests:", error);
      toast.error("Failed to load your requests. Please try again.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800";
      case "rejected":
        return "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800";
      case "pending":
      default:
        return "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatExpiryDateTime = (expiryDate, expiryTime) => {
    try {
      if (!expiryDate) return "No expiry date specified";
      const dateTimeString = expiryTime
        ? `${expiryDate}T${expiryTime}`
        : expiryDate;
      return new Date(dateTimeString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: expiryTime ? "2-digit" : undefined,
        minute: expiryTime ? "2-digit" : undefined,
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading your requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
              <p className="mt-2 text-gray-600">
                Track the status of your food requests
              </p>
            </div>
            <Button
              onClick={fetchMyRequests}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {(() => {
              const statusCounts = requests.reduce(
                (acc, req) => {
                  acc.total++;
                  acc[req.status || "pending"]++;
                  return acc;
                },
                { total: 0, pending: 0, approved: 0, rejected: 0 },
              );
              return (
                <>
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">
                          {statusCounts.total}
                        </p>
                        <p className="text-sm text-gray-600">Total Requests</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">
                          {statusCounts.pending}
                        </p>
                        <p className="text-sm text-gray-600">Pending</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">
                          {statusCounts.approved}
                        </p>
                        <p className="text-sm text-gray-600">Approved</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <XCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">
                          {statusCounts.rejected}
                        </p>
                        <p className="text-sm text-gray-600">Rejected</p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Requests Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't made any food requests yet. Browse available food
                items and make your first request!
              </p>
              <Button
                onClick={() => navigate("/find-food")}
                className="bg-green-600 hover:bg-green-700"
              >
                Browse Food Items
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {request.food?.foodName ||
                            request.food?.name ||
                            "Unknown Food"}
                        </h3>
                        <div className={getStatusBadge(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">
                            {request.status || "pending"}
                          </span>
                        </div>
                      </div>

                      {request.food?.foodDescription && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {request.food.foodDescription}
                        </p>
                      )}

                      {/* Food Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {request.food?.location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">
                              {request.food.location}
                            </span>
                          </div>
                        )}

                        {request.food?.expiryDate && (
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">
                              Expires:{" "}
                              {formatExpiryDateTime(
                                request.food.expiryDate,
                                request.food.expiryTime,
                              )}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            Requested: {formatDate(request.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Donor Info */}
                      {request.food?.donorName && (
                        <div className="flex items-center text-gray-600 mb-4">
                          <User className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            Donated by: {request.food.donorName}
                          </span>
                        </div>
                      )}

                      {/* Status-specific messages */}
                      {request.status === "approved" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center text-green-800">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">
                              Request Approved! You can now collect this food
                              item.
                            </span>
                          </div>
                        </div>
                      )}

                      {request.status === "rejected" && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center text-red-800">
                            <XCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">
                              Request was not approved. The food may no longer
                              be available.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Food Image */}
                    <div className="ml-6 flex-shrink-0">
                      {request.food?.image ? (
                        <img
                          src={request.food.image}
                          alt={request.food.foodName || request.food.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() =>
                        navigate(`/food/${request.food?._id || request.foodId}`)
                      }
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Button>

                    {request.status === "pending" && (
                      <span className="text-sm text-gray-500">
                        Waiting for donor response...
                      </span>
                    )}

                    {request.status === "approved" && (
                      <span className="text-sm text-green-600 font-medium">
                        ✓ Ready for collection
                      </span>
                    )}
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

export default MyRequests;
