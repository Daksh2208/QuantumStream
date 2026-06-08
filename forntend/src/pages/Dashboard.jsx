import { useState } from 'react';
import {
  LayoutDashboard, Activity, TerminalSquare, Settings as SettingsIcon, LogOut, Orbit, PanelLeftClose, PanelLeftOpen,
  Cpu, Zap, CheckCircle2, XCircle, Clock, Layers, MoreVertical, Play
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { logoutUser } from '../services/authService.js';
import Settings from './Settings.jsx';

// --- Mock Data ---
const usageData = [
  { time: '00:00', qpu: 12, sim: 45 },
  { time: '04:00', qpu: 25, sim: 30 },
  { time: '08:00', qpu: 65, sim: 80 },
  { time: '12:00', qpu: 85, sim: 120 },
  { time: '16:00', qpu: 45, sim: 90 },
  { time: '20:00', qpu: 30, sim: 50 },
];

const recentJobs = [
  { id: 'qs-8924', name: 'Grover Search', type: 'QPU', status: 'Running', time: '12s ago' },
  { id: 'qs-8923', name: 'VQE Molecule', type: 'Simulator', status: 'Completed', time: '5m ago' },
  { id: 'qs-8922', name: 'QAOA MaxCut', type: 'Simulator', status: 'Completed', time: '12m ago' },
  { id: 'qs-8921', name: 'GHZ State 3-Qubit', type: 'QPU', status: 'Failed', time: '1h ago' },
];

const savedCircuits = [
  { id: 'c-1', name: 'Bell State Prep', qubits: 2, gates: 2, updated: '2 hours ago' },
  { id: 'c-2', name: 'Quantum Teleportation', qubits: 3, gates: 7, updated: '1 day ago' },
  { id: 'c-3', name: "Grover's Algorithm", qubits: 2, gates: 14, updated: '3 days ago' },
  { id: 'c-4', name: 'VQE Ansatz', qubits: 4, gates: 36, updated: '1 week ago' },
  { id: 'c-5', name: "Shor's 15-Factorization", qubits: 5, gates: 42, updated: '2 weeks ago' },
  { id: 'c-6', name: 'QFT (4-qubit)', qubits: 4, gates: 16, updated: '1 month ago' },
];

export default function Dashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout(); // Notify App.jsx to drop the current user from state
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-blue-600/20 selection:text-blue-700">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 flex-col hidden md:flex transition-all duration-300 ease-in-out relative ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        
        {/* Dynamic Header: Row when open, Column when closed */}
        <div className={`p-6 pb-4 flex ${isSidebarOpen ? 'flex-row items-center justify-between' : 'flex-col items-center gap-6'} transition-all duration-300 overflow-hidden`}>
          <button onClick={() => setActiveView('dashboard')} className="flex items-center gap-3 hover:opacity-80 transition-opacity outline-none text-left">
            <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-1.5 rounded-lg shadow-md shadow-blue-600/20 shrink-0">
              <Orbit className="h-5 w-5 text-white" />
            </div>
            {isSidebarOpen && <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap animate-in fade-in duration-300">QuantumStream</span>}
          </button>
          
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            className="flex items-center justify-center p-1.5 bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-md transition-colors shrink-0"
          >
            {isSidebarOpen ? <PanelLeftClose size={20} strokeWidth={1.5} /> : <PanelLeftOpen size={20} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1.5 mt-2 overflow-hidden">
          <button onClick={() => setActiveView('dashboard')} title={!isSidebarOpen ? "Dashboard" : undefined} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 justify-start' : 'justify-center'} py-2.5 rounded-lg font-medium text-sm transition-colors ${activeView === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <LayoutDashboard size={18} className="shrink-0" />
            {isSidebarOpen && <span className="ml-3 whitespace-nowrap animate-in fade-in duration-300">Dashboard</span>}
          </button>
          <button onClick={() => setActiveView('circuits')} title={!isSidebarOpen ? "Circuits" : undefined} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 justify-start' : 'justify-center'} py-2.5 rounded-lg font-medium text-sm transition-colors ${activeView === 'circuits' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <TerminalSquare size={18} className="shrink-0" />
            {isSidebarOpen && <span className="ml-3 whitespace-nowrap animate-in fade-in duration-300">Circuits</span>}
          </button>
          <button onClick={() => setActiveView('jobs')} title={!isSidebarOpen ? "Jobs" : undefined} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 justify-start' : 'justify-center'} py-2.5 rounded-lg font-medium text-sm transition-colors ${activeView === 'jobs' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Activity size={18} className="shrink-0" />
            {isSidebarOpen && <span className="ml-3 whitespace-nowrap animate-in fade-in duration-300">Jobs</span>}
          </button>
          <button onClick={() => setActiveView('settings')} title={!isSidebarOpen ? "Settings" : undefined} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 justify-start' : 'justify-center'} py-2.5 rounded-lg font-medium text-sm transition-colors ${activeView === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <SettingsIcon size={18} className="shrink-0" />
            {isSidebarOpen && <span className="ml-3 whitespace-nowrap animate-in fade-in duration-300">Settings</span>}
          </button>
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-200 overflow-hidden">
          <div className={`flex items-center ${isSidebarOpen ? 'justify-start px-2' : 'justify-center'} gap-3 mb-4`}>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden animate-in fade-in duration-300">
                <span className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Developer'}</span>
                <span className="text-xs text-slate-500 truncate">{user?.email || 'user@quantumstream.io'}</span>
              </div>
            )}
          </div>
          <button onClick={handleLogout} title={!isSidebarOpen ? "Sign Out" : undefined} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 justify-start' : 'justify-center'} py-2 text-rose-600 hover:bg-rose-50 rounded-lg font-medium text-sm transition-colors`}>
            <LogOut size={18} className="shrink-0" />
            {isSidebarOpen && <span className="ml-2 whitespace-nowrap animate-in fade-in duration-300">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {activeView === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-10">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Workspace Overview</h1>
                <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.name?.split(' ')[0] || 'Developer'}. Here's your quantum execution status.</p>
              </div>
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-blue-600/20">
                + New Circuit
              </button>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Activity size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Jobs</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">12</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Cpu size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">QPU Time (ms)</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">1,492</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Zap size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Simulations</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">348</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-6">Compute Utilization</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={usageData}>
                      <defs>
                        <linearGradient id="colorQpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#93c5fd" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="qpu" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorQpu)" />
                      <Area type="monotone" dataKey="sim" stroke="#93c5fd" strokeWidth={3} fillOpacity={1} fill="url(#colorSim)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-bold text-slate-900">Recent Executions</h3>
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</button>
                </div>
                <div className="space-y-3">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        {job.status === 'Completed' ? (
                          <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                        ) : job.status === 'Running' ? (
                          <Clock className="text-blue-500 h-5 w-5 animate-spin-slow" />
                        ) : (
                          <XCircle className="text-rose-500 h-5 w-5" />
                        )}
                        <div>
                          <p className="text-sm font-bold text-slate-900">{job.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-slate-500">{job.id}</span>
                            <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">{job.type}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-400">{job.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'settings' && <Settings user={user} />}
        
        {activeView === 'circuits' && (
          <div className="animate-in fade-in duration-300">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-10">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Circuits</h1>
                <p className="text-sm text-slate-500 mt-1">Manage and design your quantum algorithms.</p>
              </div>
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-blue-600/20">
                + New Circuit
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {savedCircuits.map((circuit) => (
                <div key={circuit.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group cursor-pointer flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <TerminalSquare size={24} strokeWidth={1.5} />
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{circuit.name}</h3>
                    <p className="text-xs font-mono text-slate-500 mb-6">{circuit.id}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5" title="Qubits">
                        <Cpu size={14} className="text-slate-400" />
                        <span>{circuit.qubits}</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                      <div className="flex items-center gap-1.5" title="Gates">
                        <Layers size={14} className="text-slate-400" />
                        <span>{circuit.gates}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-medium text-slate-400">{circuit.updated}</span>
                      <button className="h-7 w-7 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors" title="Run Simulator">
                        <Play size={12} className="fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeView === 'jobs' && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Jobs</h1>
            <p className="text-sm text-slate-500 mt-1">This section is under construction.</p>
          </div>
        )}
      </main>
    </div>
  );
}
