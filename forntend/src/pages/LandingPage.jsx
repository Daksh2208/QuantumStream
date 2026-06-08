import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Orbit, Play, BarChart, ChevronRight, Menu, X, ArrowRight, Zap, Code, TerminalSquare, Activity, ShieldCheck, Database, Layers, Layout
} from 'lucide-react';
import {
  BarChart as RechartsBarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import './LandingPage.css';

// --- Mock Data ---
const probabilityData = [
  { state: '|00⟩', prob: 49.8 },
  { state: '|01⟩', prob: 0.1 },
  { state: '|10⟩', prob: 0.1 },
  { state: '|11⟩', prob: 50.0 },
];

const performanceData = [
  { time: '0ms', qpu: 10, sim: 20 },
  { time: '10ms', qpu: 45, sim: 30 },
  { time: '20ms', qpu: 80, sim: 50 },
  { time: '30ms', qpu: 120, sim: 90 },
  { time: '40ms', qpu: 150, sim: 130 },
];

// --- Animation Variants ---
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// --- Components ---

const Navbar = ({ onLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Orbit className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">QuantumStream</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'Simulation', 'Analytics'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={onLogin} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Sign In</button>
          <button onClick={onLogin} className="btn-primary px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            Get Started <ArrowRight size={16} />
          </button>
        </div>

        <button className="md:hidden text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-blue-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4 flex flex-col">
              {['Features', 'Simulation', 'Analytics'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                  {item}
                </a>
              ))}
              <hr className="border-blue-50" />
              <button onClick={() => { onLogin(); setMobileMenuOpen(false); }} className="text-left text-base font-medium text-slate-600">Sign In</button>
              <button onClick={() => { onLogin(); setMobileMenuOpen(false); }} className="btn-primary px-5 py-2 rounded-md text-base font-medium text-center">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = ({ onStartBuilding }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-grid opacity-60 z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] orb-bg rounded-full blur-3xl z-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-6">
              <Zap size={16} />
              <span>Next-Gen Quantum Workspace</span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Design Quantum <br />
              Circuits with <span className="text-gradient">Precision</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
              An elegant, high-performance platform for visual circuit design, advanced simulation, and execution analytics. Built for modern quantum developers.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-4 mb-12">
              <button onClick={onStartBuilding} className="btn-primary px-8 py-3.5 rounded-full font-medium flex items-center gap-2">
                Start Building <ChevronRight size={18} />
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-2xl shadow-blue-900/5 relative z-10 animate-float">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                </div>
                <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Bell_State.qasm</div>
              </div>
              
              {/* Circuit Timeline */}
              <div className="space-y-8 font-mono text-sm mb-8">
                <div className="flex items-center text-slate-400">
                  <span className="w-8 font-bold text-slate-500">Q0</span>
                  <div className="h-px bg-slate-200 flex-1 relative flex items-center">
                    <div className="absolute left-8 w-8 h-8 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">H</div>
                    <div className="absolute left-32 w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                    <div className="absolute left-32 top-0 w-px h-12 bg-blue-600"></div>
                  </div>
                </div>
                <div className="flex items-center text-slate-400">
                  <span className="w-8 font-bold text-slate-500">Q1</span>
                  <div className="h-px bg-slate-200 flex-1 relative flex items-center">
                    <div className="absolute left-[118px] w-8 h-8 bg-white border border-blue-200 rounded flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">X</div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                  <Play size={14} className="fill-current"/> Execute Simulation
                </button>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -right-8 top-12 bg-white border border-blue-50 rounded-xl p-4 shadow-xl z-20 animate-float-delayed flex items-center gap-4">
              <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600"><Activity size={24}/></div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</div>
                <div className="text-base font-extrabold text-slate-800">Simulating...</div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Capabilities = () => {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Platform Capabilities</h2>
          <p className="text-lg text-slate-600">A seamless environment designed to accelerate your quantum computing workflows with modern tooling.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          
          {/* Main Card */}
          <motion.div variants={fadeUpVariant} className="md:col-span-2 bento-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Layers size={160} className="text-blue-600" />
            </div>
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Layout size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Visual Circuit Architect</h3>
            <p className="text-slate-600 max-w-md text-lg">
              Design complex quantum circuits through an intuitive, interactive drag-and-drop interface. Map multi-qubit timelines with absolute clarity.
            </p>
          </motion.div>

          {/* Sub Card 1 */}
          <motion.div variants={fadeUpVariant} className="bento-card rounded-3xl p-8">
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">OpenQASM Export</h3>
            <p className="text-slate-600">
              Instantly generate industry-standard OpenQASM code as you build your circuits visually.
            </p>
          </motion.div>

          {/* Sub Card 2 */}
          <motion.div variants={fadeUpVariant} className="bento-card rounded-3xl p-8">
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6">
              <TerminalSquare size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Qiskit Engine</h3>
            <p className="text-slate-600">
              Execute high-performance simulations powered by the robust Qiskit Aer backend.
            </p>
          </motion.div>

          {/* Sub Card 3 */}
          <motion.div variants={fadeUpVariant} className="md:col-span-2 bento-card rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
             <div className="flex-1">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <Database size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">State Persistence</h3>
                <p className="text-slate-600">
                  Save, version, and share your circuit states securely. Access your workspace from anywhere.
                </p>
             </div>
             <div className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-center">
                <ShieldCheck size={48} className="text-blue-300" />
             </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

const Analytics = () => {
  return (
    <section id="analytics" className="py-24 bg-blue-50/50 border-y border-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Execution Analytics</h2>
            <p className="text-lg text-slate-600">Deep dive into probability distributions and performance metrics instantly after execution.</p>
          </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Chart 1 */}
          <motion.div variants={fadeUpVariant} className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-900 text-lg">Probability Distribution</h3>
              <BarChart size={20} className="text-blue-500" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={probabilityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <RechartsTooltip cursor={{fill: '#eff6ff'}} />
                  <Bar dataKey="prob" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2 */}
          <motion.div variants={fadeUpVariant} className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-900 text-lg">Simulation Performance</h3>
              <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-600 rounded-full"></div> QPU</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-300 rounded-full"></div> Sim</div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="qpu" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorQpu)" />
                  <Area type="monotone" dataKey="sim" stroke="#93c5fd" strokeWidth={3} fillOpacity={1} fill="url(#colorSim)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

const CTA = ({ onStartBuilding }) => {
  return (
    <section className="py-32 bg-white relative overflow-hidden text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] orb-bg rounded-full blur-3xl z-0 pointer-events-none"></div>
      
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariant}
        className="max-w-3xl mx-auto px-4 relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Ready to Build the Future?</h2>
        <p className="text-xl text-slate-600 mb-10">
          Join modern developers creating the next generation of quantum applications.
        </p>
        <button onClick={onStartBuilding} className="btn-primary px-10 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2">
          Open Workspace <ArrowRight size={20} />
        </button>
      </motion.div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-50 py-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Orbit className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold text-slate-900">QuantumStream</span>
        </div>
        <div className="flex gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
        </div>
        <div className="text-sm text-slate-400">
          © {new Date().getFullYear()} QuantumStream.
        </div>
      </div>
    </footer>
  );
};

const LandingPage = ({ onLogin, onStartBuilding }) => {
  return (
    <div className="qs-landing">
      <Navbar onLogin={onLogin} />
      <main>
        <Hero onStartBuilding={onStartBuilding} />
        <Capabilities />
        <Analytics />
        <CTA onStartBuilding={onStartBuilding} />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
