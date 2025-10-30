import { useState, useEffect } from "react";
import {
   StarIcon,
   ThumbsUpIcon,
   MessageSquareIcon,
   TrendingUpIcon,
   FilterIcon,
} from "lucide-react";
import { ReviewReplyModal } from "../components/modals/ReviewReplyModal";
import { Toast } from "../components/Toast";
import { adminReviewsAPI } from "../../api/adapters/admin";
import { useAdminList } from "../../hooks/useAdmin";

export function Reviews() {
   const [selectedReview, setSelectedReview] = useState<string | null>(null);
   const [filterRating, setFilterRating] = useState("All Ratings");
   const [filterStatus, setFilterStatus] = useState("All Status");
   const [searchQuery, setSearchQuery] = useState("");
   const [toast, setToast] = useState<{
      message: string;
      type: "success" | "error" | "warning";
   } | null>(null);

   const {
      data: reviews = [],
      loading,
      fetch,
   } = useAdminList(adminReviewsAPI.getAll);

   useEffect(() => {
      console.log("Reviews - Fetching data...");
      fetch().then(() => {
         console.log("Reviews - Data fetched:", reviews);
      });
   }, [fetch]);

   useEffect(() => {
      console.log("Reviews - Current reviews state:", reviews);
   }, [reviews]);

   const handleReplySuccess = () => {
      setSelectedReview(null);
      setToast({ message: "Reply added successfully!", type: "success" });
      fetch();
   };

   const handleDeleteReview = async (id: string, customerName: string) => {
      if (confirm(`Delete review from ${customerName}?`)) {
         try {
            await adminReviewsAPI.delete(id);
            setToast({ message: "Review deleted!", type: "success" });
            fetch();
         } catch (err: any) {
            setToast({ message: err.message, type: "error" });
         }
      }
   };

   const handleApprove = async (id: string) => {
      try {
         await adminReviewsAPI.approve(id);
         setToast({ message: "Review approved!", type: "success" });
         fetch();
      } catch (err: any) {
         setToast({ message: err.message, type: "error" });
      }
   };

   const handleReject = async (id: string) => {
      try {
         await adminReviewsAPI.reject(id);
         setToast({ message: "Review rejected!", type: "success" });
         fetch();
      } catch (err: any) {
         setToast({ message: err.message, type: "error" });
      }
   };
   const getSentimentColor = (rating: number) => {
      if (rating >= 4) return "bg-green-100 text-green-700";
      if (rating === 3) return "bg-yellow-100 text-yellow-700";
      return "bg-red-100 text-red-700";
   };

   const getSentimentText = (rating: number) => {
      if (rating >= 4) return "positive";
      if (rating === 3) return "neutral";
      return "negative";
   };

   // Filter reviews based on search and filters
   const filteredReviews = (reviews || []).filter((review: any) => {
      const matchesSearch =
         review.reviewText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         review.customerName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
         review.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRating =
         filterRating === "All Ratings" ||
         (filterRating === "5 Stars" && review.rating === 5) ||
         (filterRating === "4 Stars" && review.rating === 4) ||
         (filterRating === "3 Stars" && review.rating === 3) ||
         (filterRating === "Below 3" && review.rating < 3);

      const matchesStatus =
         filterStatus === "All Status" ||
         (filterStatus === "Pending Reply" && !review.adminResponse) ||
         (filterStatus === "Replied" && review.adminResponse);

      return matchesSearch && matchesRating && matchesStatus;
   });

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">
                  Reviews & Feedback
               </h1>
               <p className="text-gray-600 mt-1">
                  Manage customer reviews and responses
               </p>
            </div>
         </div>

         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-start justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                     <TrendingUpIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                     <p className="text-sm font-semibold text-gray-800">
                        Total Reviews
                     </p>
                     <p className="text-xs text-gray-600">
                        {reviews?.length || 0} reviews collected
                     </p>
                  </div>
               </div>
               <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {reviews?.length
                     ? (
                          reviews.reduce(
                             (sum: number, r: any) => sum + (r.rating || 0),
                             0
                          ) / reviews.length
                       ).toFixed(1)
                     : "0"}{" "}
                  avg
               </span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Total Reviews</h3>
                  <ThumbsUpIcon className="w-5 h-5 text-pink-400" />
               </div>
               <p className="text-3xl font-bold text-gray-800">
                  {reviews?.length || 0}
               </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Positive (4+)</h3>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
               </div>
               <p className="text-3xl font-bold text-gray-800">
                  {reviews?.length
                     ? Math.round(
                          (reviews.filter((r: any) => r.rating >= 4).length /
                             reviews.length) *
                             100
                       )
                     : 0}
                  %
               </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Pending Reply</h3>
                  <MessageSquareIcon className="w-5 h-5 text-orange-400" />
               </div>
               <p className="text-3xl font-bold text-gray-800">
                  {reviews?.filter((r: any) => !r.adminResponse).length || 0}
               </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Avg Rating</h3>
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
               </div>
               <p className="text-3xl font-bold text-gray-800">
                  {reviews?.length
                     ? (
                          reviews.reduce(
                             (sum: number, r: any) => sum + (r.rating || 0),
                             0
                          ) / reviews.length
                       ).toFixed(1)
                     : "0"}
               </p>
            </div>
         </div>

         <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-pink-100 flex items-center gap-4">
               <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
               />
               <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm">
                  <option>All Ratings</option>
                  <option>5 Stars</option>
                  <option>4 Stars</option>
                  <option>3 Stars</option>
                  <option>Below 3</option>
               </select>
               <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm">
                  <option>All Status</option>
                  <option>Pending Reply</option>
                  <option>Replied</option>
               </select>
               <button className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
                  <FilterIcon className="w-5 h-5 text-gray-600" />
               </button>
            </div>
            {loading ? (
               <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
               </div>
            ) : (
               <div className="p-6 space-y-4">
                  {(filteredReviews || []).map((review: any) => (
                     <div
                        key={review.id}
                        className="bg-gradient-to-br from-pink-50/30 to-purple-50/30 rounded-2xl p-5 border border-pink-100 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                              {review.customerName?.charAt(0) ||
                                 review.avatar ||
                                 "?"}
                           </div>
                           <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                 <div>
                                    <h4 className="font-semibold text-gray-800">
                                       {review.customerName || "Guest"}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                       {new Date(
                                          review.createdAt
                                       ).toLocaleDateString()}{" "}
                                       • {review.service?.name || "Service"}
                                    </p>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <span
                                       className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(
                                          review.rating
                                       )}`}>
                                       {getSentimentText(review.rating)}
                                    </span>
                                    <div className="flex items-center gap-1">
                                       {[...Array(5)].map((_, i) => (
                                          <StarIcon
                                             key={i}
                                             className={`w-4 h-4 ${
                                                i < review.rating
                                                   ? "text-yellow-400 fill-yellow-400"
                                                   : "text-gray-300"
                                             }`}
                                          />
                                       ))}
                                    </div>
                                 </div>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">
                                 {review.reviewText}
                              </p>
                              {review.adminResponse && (
                                 <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-200">
                                    <p className="text-xs text-blue-600 font-semibold mb-1">
                                       Admin Response:
                                    </p>
                                    <p className="text-sm text-blue-700">
                                       {review.adminResponse}
                                    </p>
                                 </div>
                              )}
                              <div className="flex items-center gap-2">
                                 {review.adminResponse ? (
                                    <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                                       <MessageSquareIcon className="w-3 h-3" />
                                       Replied
                                    </span>
                                 ) : (
                                    <button
                                       onClick={() =>
                                          setSelectedReview(review.id)
                                       }
                                       className="text-xs text-pink-600 bg-pink-50 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors flex items-center gap-1">
                                       <MessageSquareIcon className="w-3 h-3" />
                                       Reply
                                    </button>
                                 )}
                                 {!review.approved && (
                                    <>
                                       <button
                                          onClick={() =>
                                             handleApprove(review.id)
                                          }
                                          className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                                          Approve
                                       </button>
                                       <button
                                          onClick={() =>
                                             handleReject(review.id)
                                          }
                                          className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition-colors">
                                          Reject
                                       </button>
                                    </>
                                 )}
                                 <button
                                    onClick={() =>
                                       handleDeleteReview(
                                          review.id,
                                          review.customerName || "Guest"
                                       )
                                    }
                                    className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition-colors">
                                    Delete
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         <ReviewReplyModal
            isOpen={!!selectedReview}
            onClose={() => setSelectedReview(null)}
            reviewId={selectedReview || ""}
            onSuccess={handleReplySuccess}
         />
         {toast && (
            <Toast
               message={toast.message}
               type={toast.type}
               onClose={() => setToast(null)}
            />
         )}
      </div>
   );
}

export { Reviews as default };
