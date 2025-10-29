import { SparklesIcon, ClockIcon, DollarSignIcon, EyeIcon, EyeOffIcon, Edit3Icon } from 'lucide-react';
const services = [{
  id: 1,
  name: 'Luxury Facial Treatment',
  category: 'Facial',
  duration: '60 min',
  price: '$120',
  visible: true,
  image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop'
}, {
  id: 2,
  name: 'Deep Tissue Massage',
  category: 'Massage',
  duration: '90 min',
  price: '$150',
  visible: true,
  image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop'
}, {
  id: 3,
  name: 'Hair Styling & Treatment',
  category: 'Hair',
  duration: '120 min',
  price: '$200',
  visible: true,
  image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'
}, {
  id: 4,
  name: 'Manicure & Pedicure',
  category: 'Nails',
  duration: '75 min',
  price: '$85',
  visible: true,
  image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop'
}];
export function Services() {
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Services</h1>
          <p className="text-gray-600 mt-1">
            Manage your clinic services and treatments
          </p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm">
          Add New Service
        </button>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">AI Suggestion:</span> Generate
            service descriptions automatically with our AI assistant
          </p>
          <button className="ml-auto px-4 py-2 bg-white rounded-lg text-sm font-medium text-pink-600 hover:bg-pink-50 transition-colors">
            Try AI Writer
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => <div key={service.id} className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="relative h-48 overflow-hidden">
              <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                {service.category}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {service.name}
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ClockIcon className="w-4 h-4 text-pink-400" />
                  <span>{service.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSignIcon className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-gray-800">
                    {service.price}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-pink-100">
                <button className="flex-1 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors flex items-center justify-center gap-2">
                  <Edit3Icon className="w-4 h-4" />
                  Edit
                </button>
                <button className={`p-2 rounded-lg transition-colors ${service.visible ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {service.visible ? <EyeIcon className="w-4 h-4" /> : <EyeOffIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}