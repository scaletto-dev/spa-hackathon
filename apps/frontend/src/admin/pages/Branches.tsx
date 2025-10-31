import { useState } from 'react';
import { MapPinIcon, PhoneIcon, ClockIcon, Edit3Icon, TrendingUpIcon, PlusIcon, Trash2Icon, SearchIcon, FilterIcon } from 'lucide-react';
import { adminBranchesAPI } from '../../api/adapters/admin';
import { useAdminList } from '../../hooks/useAdmin';
import { Toast } from '../components/Toast';
import { BranchModal } from '../components/modals/BranchModal';

export function Branches() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Branches');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const { data: branches = [], loading, fetch, page, limit, total, goToPage, setPageSize } = useAdminList(adminBranchesAPI.getAll);

  const handleBranchSuccess = () => {
    setIsModalOpen(false);
    setSelectedBranch(null);
    setToast({ message: 'Branch saved successfully!', type: 'success' });
    fetch();
  };

  const handleEditBranch = (branch: any) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (branchId: string) => {
    try {
      await adminBranchesAPI.toggleActive(branchId);
      setToast({ message: 'Branch status updated!', type: 'success' });
      fetch();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (branchId: string, branchName: string) => {
    if (confirm(`Delete "${branchName}"?`)) {
      try {
        await adminBranchesAPI.delete(branchId);
        setToast({ message: 'Branch deleted!', type: 'success' });
        fetch();
      } catch (err: any) {
        setToast({ message: err.message, type: 'error' });
      }
    }
  };

  // Filter branches based on search and status
  const filteredBranches = (branches || []).filter((branch: any) => {
    const matchesSearch = 
      branch.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.phone?.includes(searchQuery);
    
    const matchesStatus = 
      statusFilter === 'All Branches' ||
      (statusFilter === 'Open' && branch.active) ||
      (statusFilter === 'Closed' && !branch.active);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Branches</h1>
          <p className="text-gray-600 mt-1">Manage your clinic locations</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add New Branch
        </button>
      </div>

      {/* Search and Filter */}
      <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm p-4 flex items-center gap-4'>
        <div className='relative flex-1'>
          <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Search branches by name, address or phone...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className='px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
        >
          <option>All Branches</option>
          <option>Open</option>
          <option>Closed</option>
        </select>
        <button className='p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors'>
          <FilterIcon className='w-5 h-5 text-gray-600' />
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredBranches || []).map((branch: any) => (
            <div key={branch.id} className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden bg-gray-200">
                {branch.images?.[0] ? (
                  <img src={branch.images[0]} alt={branch.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className={`${branch.active ? 'bg-green-500' : 'bg-gray-400'} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    {branch.active ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {branch.name}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4 text-purple-400" />
                    <span>{branch.phone}</span>
                  </div>
                  {branch.operatingHours && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4 text-blue-400" />
                      <span>Hours available</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-pink-100">
                  <button onClick={() => handleEditBranch(branch)} className="flex-1 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors flex items-center justify-center gap-2">
                    <Edit3Icon className="w-4 h-4" />
                    Edit
                  </button>
                  <button onClick={() => handleToggleActive(branch.id)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <TrendingUpIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(branch.id, branch.name)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && branches.length > 0 && (
        <div className='flex items-center justify-between p-4 border-t border-blue-100 bg-blue-50/30'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-700'>Items per page:</span>
            <select
              value={limit}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className='px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className='flex flex-1 items-center justify-center gap-4'>
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className='px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium'
            >
              Previous
            </button>

            <div className='text-sm text-gray-600 min-w-max'>
              Page <span className='font-semibold'>{page}</span> of <span className='font-semibold'>{Math.ceil(total / limit)}</span>
            </div>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className='px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium'
            >
              Next
            </button>
          </div>

          <div className='text-sm text-gray-500'>
            {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total}
          </div>
        </div>
      )}
      <BranchModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBranch(null);
        }}
        onSuccess={handleBranchSuccess} 
        branch={selectedBranch}
        mode={selectedBranch ? 'edit' : 'create'}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
export { Branches as default };
