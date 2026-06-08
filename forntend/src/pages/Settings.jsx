import { User, Bell, Shield, Key } from 'lucide-react';

export default function Settings({ user }) {
  return (
    <div className="max-w-5xl mx-auto w-full animate-in fade-in duration-300">
      <header className="mb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account preferences and workspace configurations.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
          {/* Settings Sidebar */}
          <div className="p-6 border-r border-slate-200 bg-slate-50">
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm">
                <User size={18} /> Profile
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors">
                <Bell size={18} /> Notifications
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors">
                <Shield size={18} /> Security
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors">
                <Key size={18} /> API Keys
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="col-span-3 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Profile Information</h2>
            
            <form className="space-y-6 max-w-lg">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || ''}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1.5">Email address cannot be changed. Contact support if needed.</p>
              </div>

              <div className="pt-4">
                <button type="button" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-blue-600/20">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}