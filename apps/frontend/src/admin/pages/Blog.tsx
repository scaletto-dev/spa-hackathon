import { useState } from "react";
import {
   PlusIcon,
   Edit3Icon,
   EyeIcon,
   EyeOffIcon,
   Trash2Icon,
   SparklesIcon,
   SearchIcon,
   FilterIcon,
} from "lucide-react";
import { CustomDropdown } from "../components/CustomDropdown";
import { BlogPostModal } from "../components/modals/BlogPostModal";
import { Toast } from "../components/Toast";
import { adminBlogAPI } from "../../api/adapters/admin";
import { useAdminList } from "../../hooks/useAdmin";

export function Blog() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedPost, setSelectedPost] = useState<any>(null);
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState("All Posts");
   const [toast, setToast] = useState<{
      message: string;
      type: "success" | "error" | "warning";
   } | null>(null);

   const {
      data: posts = [],
      loading,
      fetch,
      page,
      limit,
      total,
      goToPage,
      setPageSize,
   } = useAdminList(adminBlogAPI.getAll);

   const handlePostCreated = () => {
      setIsModalOpen(false);
      setSelectedPost(null);
      setToast({ message: "Blog post created successfully!", type: "success" });
      fetch();
   };

   const handleEditPost = (post: any) => {
      setSelectedPost(post);
      setIsModalOpen(true);
   };

   const handleTogglePublish = async (
      postId: string,
      currentStatus: string
   ) => {
      try {
         if (currentStatus === "PUBLISHED") {
            await adminBlogAPI.unpublish(postId);
         } else {
            await adminBlogAPI.publish(postId);
         }
         setToast({
            message: `Post ${
               currentStatus === "PUBLISHED" ? "unpublished" : "published"
            }!`,
            type: "success",
         });
         fetch();
      } catch (err: any) {
         setToast({ message: err.message, type: "error" });
      }
   };

   const handleDeletePost = async (postId: string, title: string) => {
      if (window.confirm(`Delete blog post "${title}"?`)) {
         try {
            await adminBlogAPI.delete(postId);
            setToast({ message: "Blog post deleted!", type: "success" });
            fetch();
         } catch (err: any) {
            setToast({ message: err.message, type: "error" });
         }
      }
   };

   // Filter posts based on search and status
   const filteredPosts = (posts || []).filter((post: any) => {
      const matchesSearch =
         post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
         statusFilter === "All Posts" ||
         (statusFilter === "Published" && post.publishedAt) ||
         (statusFilter === "Draft" && !post.publishedAt);

      return matchesSearch && matchesStatus;
   });

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">
                  Blog & Content
               </h1>
               <p className="text-gray-600 mt-1">
                  Manage your blog posts and articles
               </p>
            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center gap-2">
               <PlusIcon className="w-5 h-5" />
               New Post
            </button>
         </div>
         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
               </div>
               <p className="text-sm text-gray-700">
                  <span className="font-semibold">Blog Posts:</span>{" "}
                  {posts?.length || 0} total posts
               </p>
               <span className="ml-auto px-3 py-1 bg-white rounded-full text-xs font-medium text-purple-600">
                  {posts?.filter((p: any) => p.publishedAt).length || 0}{" "}
                  Published
               </span>
            </div>
         </div>

         {/* Search and Filter */}
         <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm p-4 flex items-center gap-4">
            <div className="relative flex-1">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input
                  type="text"
                  placeholder="Search posts by title or excerpt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
               />
            </div>
            <CustomDropdown
               value={statusFilter}
               onChange={setStatusFilter}
               color="blue"
               options={[
                  { value: "All Posts", label: "All Posts" },
                  { value: "Published", label: "Published", icon: "✓" },
                  { value: "Draft", label: "Draft", icon: "📝" },
               ]}
            />
            <button className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
               <FilterIcon className="w-5 h-5 text-gray-600" />
            </button>
         </div>
         <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
               loading ? "opacity-50" : ""
            }`}>
            {loading ? (
               <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
               </div>
            ) : (filteredPosts || []).length === 0 ? (
               <div className="col-span-full flex justify-center py-12">
                  <p className="text-gray-400">
                     No posts found matching your search.
                  </p>
               </div>
            ) : (
               (filteredPosts || []).map((post: any) => (
                  <div
                     key={post.id}
                     className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg transition-all group">
                     <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pink-200 to-purple-200">
                        {post.featuredImage ? (
                           <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                 e.currentTarget.style.display = "none";
                                 e.currentTarget.parentElement!.innerHTML =
                                    '<div class="w-full h-full flex items-center justify-center text-gray-400">Image not found</div>';
                              }}
                           />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image
                           </div>
                        )}
                        <div className="absolute top-3 right-3">
                           <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                 post.publishedAt
                                    ? "bg-green-500 text-white"
                                    : "bg-orange-500 text-white"
                              }`}>
                              {post.publishedAt ? "published" : "draft"}
                           </span>
                        </div>
                     </div>
                     <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                           {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                           {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                           <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                        <div className="flex gap-2">
                           <button
                              onClick={() => handleEditPost(post)}
                              className="flex-1 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors flex items-center justify-center gap-1">
                              <Edit3Icon className="w-4 h-4" />
                              Edit
                           </button>
                           <button
                              onClick={() =>
                                 handleTogglePublish(
                                    post.id,
                                    post.publishedAt ? "PUBLISHED" : "DRAFT"
                                 )
                              }
                              className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
                              {post.publishedAt ? (
                                 <EyeIcon className="w-4 h-4" />
                              ) : (
                                 <EyeOffIcon className="w-4 h-4" />
                              )}
                           </button>
                           <button
                              onClick={() =>
                                 handleDeletePost(post.id, post.title)
                              }
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                              <Trash2Icon className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         {/* Pagination */}
         {!loading && posts.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm">
               <div className="flex items-center justify-between gap-4 p-6">
                  {/* Items per page */}
                  <div className="flex items-center gap-3">
                     <label className="text-sm font-medium text-gray-700">Show:</label>
                     <select
                        value={limit}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-300 transition-colors"
                     >
                        <option value={10}>10 items</option>
                        <option value={20}>20 items</option>
                        <option value={50}>50 items</option>
                        <option value={100}>100 items</option>
                     </select>
                  </div>

                  {/* Navigation buttons - centered */}
                  <div className="flex flex-1 items-center justify-center gap-6">
                     <button
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-lg border-2 border-purple-300 text-purple-700 font-medium hover:bg-purple-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                     >
                        ← Previous
                     </button>

                     <div className="text-center min-w-32">
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Page</div>
                        <div className="text-lg font-bold text-purple-600">{page} / {Math.ceil(total / limit)}</div>
                     </div>

                     <button
                        onClick={() => goToPage(page + 1)}
                        disabled={page >= Math.ceil(total / limit)}
                        className="px-4 py-2 rounded-lg border-2 border-purple-300 text-purple-700 font-medium hover:bg-purple-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                     >
                        Next →
                     </button>
                  </div>

                  {/* Item info */}
                  <div className="text-right">
                     <div className="text-xs text-gray-500 font-medium">Showing</div>
                     <div className="text-sm font-semibold text-gray-700">
                        {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
                     </div>
                  </div>
               </div>
            </div>
         )}
         <BlogPostModal
            isOpen={isModalOpen}
            onClose={() => {
               setIsModalOpen(false);
               setSelectedPost(null);
            }}
            onSuccess={handlePostCreated}
            post={selectedPost}
            mode={selectedPost ? "edit" : "create"}
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

export { Blog as default };
