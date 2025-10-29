import { MapPinIcon, PhoneIcon, ClockIcon, Edit3Icon, TrendingUpIcon } from 'lucide-react';
const branches = [{
  id: 1,
  name: 'Downtown Spa',
  address: '123 Main Street, Downtown',
  phone: '(555) 123-4567',
  hours: '9:00 AM - 8:00 PM',
  status: 'open',
  image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
  performance: '+18%'
}, {
  id: 2,
  name: 'Westside Clinic',
  address: '456 West Avenue, Westside',
  phone: '(555) 234-5678',
  hours: '10:00 AM - 7:00 PM',
  status: 'open',
  image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
  performance: '+12%'
}, {
  id: 3,
  name: 'Eastside Beauty',
  address: '789 East Boulevard, Eastside',
  phone: '(555) 345-6789',
  hours: '8:00 AM - 9:00 PM',
  status: 'open',
  image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop',
  performance: '+25%'
}];
export function Branches() {
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Branches</h1>
          <p className="text-gray-600 mt-1">Manage your clinic locations</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm">
          Add New Branch
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => <div key={branch.id} className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg transition-all">
            <div className="relative h-48 overflow-hidden">
              <img src={branch.image} alt={branch.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Open
                </span>
              </div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-green-600 flex items-center gap-1">
                <TrendingUpIcon className="w-3 h-3" />
                {branch.performance}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {branch.name}
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    {branch.address}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{branch.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{branch.hours}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-pink-100">
                <button className="flex-1 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors flex items-center justify-center gap-2">
                  <Edit3Icon className="w-4 h-4" />
                  Edit Info
                </button>
                <button className="flex-1 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  View Map
                </button>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}