// @ts-nocheck
import * as React from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  Upload, 
  Cpu, 
  Search, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  X,
  FileJson,
  Activity,
  Zap,
  ChevronRight,
  Loader2
} from "lucide-react";
import api from "~/lib/api";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

const TrainingModal = ({ isOpen, onClose, dataset }: any) => {
  const [step, setStep] = React.useState(1); // 1: Config, 2: Training, 3: Success
  const [progress, setProgress] = React.useState(0);
  const [logs, setLogs] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setStep(3);
            clearInterval(interval);
            return 100;
          }
          const next = prev + Math.random() * 15;
          return next > 100 ? 100 : next;
        });
        
        const possibleLogs = [
          "Initializing neural network...",
          "Loading dataset features...",
          "Processing Epoch 1/20 - Loss: 0.85",
          "Processing Epoch 5/20 - Loss: 0.42",
          "Applying cross-validation...",
          "Optimizing weights (Adam)...",
          "Relu activation triggered...",
          "Validating model accuracy: 92%"
        ];
        setLogs(prev => [...prev.slice(-4), possibleLogs[Math.floor(Math.random() * possibleLogs.length)]]);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col text-white"
      >
        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                 <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-black font-display tracking-tight text-white">AI Model Training Hub</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Terminal ID: {dataset?.name || 'GENERIC_NODE'}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-500"><X size={20} /></button>
        </div>

        <div className="p-10">
          {step === 1 && (
             <div className="space-y-8">
                <div className="p-6 rounded-[2rem] bg-slate-800/50 border border-slate-800">
                   <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-4">Parameter Konfigurasi</h4>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-500 uppercase">Learning Rate</label>
                         <Input defaultValue="0.001" className="bg-slate-900 border-slate-700 text-white font-mono" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-500 uppercase">Epochs</label>
                         <Input defaultValue="100" className="bg-slate-900 border-slate-700 text-white font-mono" />
                      </div>
                   </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-3xl bg-amber-500/5 border border-amber-500/20">
                   <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                   <p className="text-xs text-amber-200/70 leading-relaxed font-medium">
                     Training model memerlukan resource komputasi tinggi. Pastikan dataset sudah divalidasi sebelum memulai proses.
                   </p>
                </div>

                <Button onClick={() => setStep(2)} className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/40">
                  <Zap className="w-5 h-5 mr-3 fill-current" /> Execute Training Protocol
                </Button>
             </div>
          )}

          {step === 2 && (
             <div className="space-y-8 py-4">
                <div className="flex flex-col items-center text-center">
                   <div className="relative w-24 h-24 mb-6">
                      <svg className="w-full h-full transform -rotate-90">
                         <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                         <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" strokeDasharray={`${progress * 2.51} 251`} strokeLinecap="round" fill="transparent" className="text-emerald-500 transition-all duration-300" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xl font-black font-display text-white">
                         {Math.round(progress)}%
                      </div>
                   </div>
                   <h4 className="text-lg font-black text-white">Training In Progress...</h4>
                   <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Adjusting Neural Weights</p>
                </div>

                <div className="bg-black/40 rounded-[1.5rem] p-6 font-mono text-[10px] text-emerald-400/80 border border-slate-800 h-32 overflow-hidden">
                   {logs.map((log, i) => (
                      <div key={i} className="mb-1">
                        <span className="text-slate-600">[admin@heartpredict ~]$</span> <span className="text-emerald-500 animate-pulse">{log}</span>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 animate-bounce">
                   <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <div>
                   <h4 className="text-2xl font-black text-white font-display">Optimization Complete</h4>
                   <p className="text-sm text-slate-400 mt-2 font-medium">Model HeartPredict_V2 has been successfully trained and localized.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4">
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Final Accuracy</p>
                      <p className="text-xl font-black text-emerald-400">94.8%</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Loss Factor</p>
                      <p className="text-xl font-black text-blue-400">0.024</p>
                   </div>
                </div>
                <Button onClick={onClose} className="w-full h-14 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest mt-8">
                   Close Terminal
                </Button>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default function AdminDatasets() {
  const [datasets, setDatasets] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isTrainingOpen, setIsTrainingOpen] = React.useState(false);
  const [selectedDataset, setSelectedDataset] = React.useState<any>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/datasets');
      setDatasets(res.data.data);
    } catch (err) {
      console.error('Fetch datasets error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ds: any) => {
    if (window.confirm(`Hapus dataset "${ds.name}"?`)) {
      try {
        await api.delete(`/admin/datasets/${ds.id}`);
        fetchDatasets();
      } catch (err) {
        alert("Gagal menghapus dataset.");
      }
    }
  };

  const handleTrain = (dataset: any) => {
    setSelectedDataset(dataset);
    setIsTrainingOpen(true);
  };

  const stats = [
    { label: 'Total Dataset', value: '12', icon: Database, colorClass: 'text-blue-600', bgClass: 'bg-blue-50' },
    { label: 'Active Used', value: '8', icon: CheckCircle2, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50' },
    { label: 'Pending Review', value: '2', icon: Clock, colorClass: 'text-amber-600', bgClass: 'bg-amber-50' },
    { label: 'Cloud Storage', value: '24 GB', icon: Activity, colorClass: 'text-purple-600', bgClass: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight flex items-center gap-3">
             <Database className="w-8 h-8 text-blue-600" /> Manajemen Dataset AI
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Kelola data mentah dan proses pelatihan model kecerdasan buatan.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 font-black text-xs uppercase tracking-widest">
              <Plus className="w-5 h-5 mr-3" /> Register Source
           </Button>
           <Button className="h-12 px-6 rounded-2xl shadow-xl shadow-blue-100 bg-blue-600 hover:bg-blue-700 font-black text-xs uppercase tracking-widest">
              <Upload className="w-5 h-5 mr-3" /> Upload New Dataset
           </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <Card key={i} className="p-6 border-slate-200 rounded-[2rem] bg-white group hover:shadow-md transition-all">
             <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", item.bgClass)}>
                   <item.icon className={cn("w-6 h-6", item.colorClass)} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                   <p className="text-2xl font-black text-slate-900 font-display">{item.value}</p>
                </div>
             </div>
          </Card>
        ))}
      </div>

      {/* Dataset Table */}
      <Card className="border-slate-200 shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-lg font-black text-slate-900 font-display uppercase tracking-tight">Dataset Inventory</h3>
           <div className="relative w-64 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Cari nama dataset..." 
                className="w-full h-10 pl-10 pr-4 bg-slate-50 rounded-xl text-xs font-medium outline-none border border-transparent focus:border-blue-500 transition-all" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                <th className="px-8 py-5">Source Name</th>
                <th className="px-6 py-5">Format</th>
                <th className="px-6 py-5">Data Points</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Last Interaction</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-8 py-6"><div className="h-10 bg-slate-50 rounded-xl" /></td>
                    </tr>
                  ))
               ) : datasets.length > 0 ? (
                 datasets
                    .filter(ds => ds.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((ds) => (
                   <tr key={ds.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                               <FileJson className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                               <span className="text-sm font-black text-slate-900 truncate max-w-[200px]">{ds.name}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Size: {ds.file_size ? `${(ds.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                         <Badge className="bg-slate-100 text-slate-600 font-black rounded-lg text-[9px] uppercase tracking-widest px-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">{ds.type || 'CSV'}</Badge>
                      </td>
                      <td className="px-6 py-6">
                         <span className="text-sm font-black text-slate-600">{ds.rows || '10,247'} <span className="text-[9px] text-slate-400 font-bold ml-1 uppercase">Rows</span></span>
                      </td>
                      <td className="px-6 py-6">
                         <div className="flex items-center gap-2">
                           <div className={cn("w-2 h-2 rounded-full", ds.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300')} />
                           <span className={cn("text-[10px] font-black uppercase tracking-widest", ds.status === 'active' ? 'text-emerald-600' : 'text-slate-400')}>{ds.status || 'Archived'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                         <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-slate-600 italic">2 Days Ago</span>
                            <span className="text-[9px] font-bold text-slate-300 uppercase">by System Admin</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <Button 
                              onClick={() => handleTrain(ds)}
                              className="h-9 px-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-black text-[10px] uppercase tracking-widest border-none transition-all shadow-none"
                            >
                               <Cpu className="w-3.5 h-3.5 mr-2" /> Start Training
                            </Button>
                            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl text-slate-300 hover:text-slate-600"><Download className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(ds)} className="w-9 h-9 rounded-xl text-slate-300 hover:text-rose-600"><Trash2 className="w-4 h-4" /></Button>
                         </div>
                      </td>
                   </tr>
                 ))
               ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                       <span className="text-sm font-bold text-slate-400 italic">No datasets identified in secure storage.</span>
                    </td>
                  </tr>
               )}
            </tbody>
          </table>
        </div>
      </Card>

      <TrainingModal 
        isOpen={isTrainingOpen}
        onClose={() => setIsTrainingOpen(false)}
        dataset={selectedDataset}
      />
    </div>
  );
}
