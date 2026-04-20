import * as React from "react";
import { motion } from "framer-motion";
import { Tag, Plus, Edit, Trash2, Search, Loader2, X } from "lucide-react";
import api from "~/lib/api";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function AdminCategories() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [newCatName, setNewCatName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Fetch categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setSubmitting(true);
    try {
      if (selectedCategory) {
        await api.put(`/admin/categories/${selectedCategory.id}`, { name: newCatName });
      } else {
        await api.post('/admin/categories', { name: newCatName });
      }
      setNewCatName("");
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert("Gagal menyimpan kategori");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: any) => {
    if (window.confirm(`Hapus kategori "${cat.name}"?`)) {
      try {
        await api.delete(`/admin/categories/${cat.id}`);
        fetchCategories();
      } catch (err) {
        alert("Gagal menghapus kategori");
      }
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight flex items-center gap-3">
             <Tag className="w-8 h-8 text-amber-500" /> Kategori Artikel
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Kelola klasifikasi konten edukasi kesehatan.</p>
        </div>
        <Button onClick={() => { setSelectedCategory(null); setNewCatName(""); setIsModalOpen(true); }} className="h-12 px-6 rounded-2xl shadow-xl shadow-amber-100 bg-amber-500 hover:bg-amber-600 font-black text-xs uppercase tracking-widest text-white border-none">
          <Plus className="w-5 h-5 mr-2" /> Kategori Baru
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
        <div className="p-8 border-b border-slate-100">
           <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Cari kategori..." 
                className="w-full h-12 pl-12 pr-4 bg-slate-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-amber-500 transition-all" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
             <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-200" /></div>
          ) : categories.length > 0 ? (
            categories
              .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((cat) => (
              <div key={cat.id} className="px-8 py-5 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-black text-xs">
                       {cat.name.substring(0, 1).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900">{cat.name}</span>
                 </div>
                 <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => { setSelectedCategory(cat); setNewCatName(cat.name); setIsModalOpen(true); }}
                      className="w-9 h-9 rounded-xl hover:bg-white hover:text-amber-600 transition-all text-slate-300"
                    >
                       <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(cat)}
                      className="w-9 h-9 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all text-slate-300"
                    >
                       <Trash2 className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Belum ada kategori.</div>
          )}
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
           >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="font-black text-slate-900 font-display uppercase tracking-tight">{selectedCategory ? 'Edit Kategori' : 'Kategori Baru'}</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Kategori</label>
                    <Input 
                      required
                      autoFocus
                      placeholder="Ex: Nutrisi" 
                      className="h-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white" 
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                    />
                 </div>
                 <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest">Batal</Button>
                    <Button disabled={submitting} type="submit" className="flex-1 h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-widest border-none shadow-lg shadow-amber-100">
                       {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan'}
                    </Button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}
    </div>
  );
}
