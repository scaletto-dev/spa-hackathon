import { CustomDropdown } from "./CustomDropdown";

interface PaginationControlsProps {
   page: number;
   limit: number;
   total: number;
   goToPage: (page: number) => void;
   setPageSize: (size: number) => void;
   color?: "pink" | "purple" | "blue" | "green";
}

export function PaginationControls({
   page,
   limit,
   total,
   goToPage,
   setPageSize,
   color = "pink",
}: PaginationControlsProps) {
   const totalPages = Math.ceil(total / limit);

   const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
   const endItem = Math.min(page * limit, total);

   const pageSizeOptions = [
      { value: "10", label: "10" },
      { value: "20", label: "20" },
      { value: "50", label: "50" },
      { value: "100", label: "100" },
   ];

   const borderColor = {
      pink: "border-pink-100 bg-pink-50/30",
      purple: "border-purple-100 bg-purple-50/30",
      blue: "border-blue-100 bg-blue-50/30",
      green: "border-green-100 bg-green-50/30",
   }[color];

   const buttonColor = {
      pink: "border-pink-200 hover:bg-pink-50",
      purple: "border-purple-200 hover:bg-purple-50",
      blue: "border-blue-200 hover:bg-blue-50",
      green: "border-green-200 hover:bg-green-50",
   }[color];

   const textColor = {
      pink: "text-pink-600",
      purple: "text-purple-600",
      blue: "text-blue-600",
      green: "text-green-600",
   }[color];

   return (
      <div className={`relative z-[9999] flex items-center justify-between p-4 border-t ${borderColor}`}>
         <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Show:</span>
            <CustomDropdown
               value={limit.toString()}
               onChange={(value) => setPageSize(Number(value))}
               options={pageSizeOptions}
               color={color}
               dropUp={true}
            />
            <span className="text-sm text-gray-500">per page</span>
         </div>

         <div className="flex flex-1 items-center justify-center gap-4">
            <button
               onClick={() => goToPage(page - 1)}
               disabled={page === 1}
               className={`px-4 py-2 rounded-lg bg-white border ${buttonColor} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium`}>
               Previous
            </button>
            <div className="text-sm text-gray-600">
               Page <span className={`font-semibold ${textColor}`}>{page}</span> of{" "}
               <span className="font-semibold">{totalPages || 1}</span>
            </div>
            <button
               onClick={() => goToPage(page + 1)}
               disabled={page >= totalPages}
               className={`px-4 py-2 rounded-lg bg-white border ${buttonColor} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium`}>
               Next
            </button>
         </div>

         <div className="text-sm text-gray-600">
            {total > 0 && (
               <>
                  Showing <span className="font-semibold">{startItem}</span>-
                  <span className="font-semibold">{endItem}</span> of{" "}
               </>
            )}
            <span className="font-semibold">{total}</span> items
         </div>
      </div>
   );
}
