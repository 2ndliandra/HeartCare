// @ts-nocheck
import * as React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  X,
  Type,
  Tag,
  ImageIcon,
  Upload,
  Loader2,
  Clock,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
// @ts-ignore
import EditorJS from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import ImageTool from '@editorjs/image';
// @ts-ignore
import Embed from '@editorjs/embed';

import api from "~/lib/api";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

const ArticleModal = ({ isOpen, onClose, onSuccess, article }: any) => {
  const editorInstance = React.useRef<EditorJS | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    category: '',
    thumbnail: '',
    status: 'published'
  });
  const [categories, setCategories] = React.useState<any[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      initEditor();
      fetchCategories();
    }
    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        category: article.category || '',
        thumbnail: article.thumbnail || '',
        status: article.status || 'published'
      });
      setPreviewUrl(article.thumbnail || null);
    } else {
      setFormData({
        title: '',
        category: '',
        thumbnail: '',
        status: 'published'
      });
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [article, isOpen]);

  const initEditor = () => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        holder: 'editorjs-admin',
        tools: {
          header: Header,
          list: List,
          image: ImageTool,
          embed: Embed,
        },
        placeholder: 'Tulis konten edukasi kesehatan yang mendalam di sini...',
        data: article ? (typeof article.raw_content === 'string' ? JSON.parse(article.raw_content || '{}') : article.raw_content) : undefined,
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const savedData = await editorInstance.current?.save();
      const htmlContent = savedData?.blocks.map((block: any) => {
        if (block.type === 'paragraph') return `<p>${block.data.text}</p>`;
        if (block.type === 'header') return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
        if (block.type === 'list') {
          const items = block.data.items.map((i: string) => `<li>${i}</li>`).join('');
          return block.data.style === 'ordered' ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
        }
        return '';
      }).join('');

      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('status', formData.status);
      data.append('content', htmlContent || '');
      data.append('raw_content', JSON.stringify(savedData));

      if (selectedFile) {
        data.append('thumbnail', selectedFile);
      } else if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail);
      }

      if (article) {
        data.append('_method', 'PUT');
        await api.post(`/admin/articles/${article.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/articles', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan artikel.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-6xl max-h-[92vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="px-10 py-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">{article ? 'Update Medical Content' : 'Draft New Education'}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Scientific Writing Mode</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-200 rounded-xl transition-colors text-slate-400"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 flex flex-col lg:flex-row gap-12 no-scrollbar">
           <div className="flex-1 space-y-8">
              {error && <div className="p-4 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-rose-100">{error}</div>}
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 flex items-center gap-2 italic"> <Type size={14} /> Paper Title </label>
                <input
                  required
                  className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-100 text-3xl font-black text-slate-900 focus:outline-none focus:border-emerald-600 transition-all placeholder:text-slate-200"
                  placeholder="Ex: Hubungan Diet Garam dengan Hipertensi..."
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="prose prose-slate max-w-none">
                 <div id="editorjs-admin" className="bg-slate-50/30 p-8 rounded-[2rem] border border-slate-100 min-h-[500px]"></div>
              </div>
           </div>

           <div className="w-full lg:w-80 space-y-8 shrink-0">
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-8 sticky top-0">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"> <Tag size={14} /> Kategori </label>
                    <select 
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider outline-none focus:border-emerald-500 appearance-none"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"> <AlertCircle size={14} /> Status Publikasi </label>
                    <select 
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider outline-none focus:border-emerald-500 appearance-none"
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="draft">Draft (Simpan Internal)</option>
                      <option value="published">Published (Publikasikan)</option>
                    </select>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"> <ImageIcon size={14} /> Thumbnail </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video w-full rounded-[1.5rem] border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-white flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
                    >
                      {previewUrl ? (
                         <img src={previewUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                         <div className="flex flex-col items-center text-slate-300">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-black uppercase">Click to upload</span>
                         </div>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                    </div>
                 </div>

                 <div className="pt-4 space-y-3">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={loading}
                      className="w-full h-14 rounded-2xl shadow-xl shadow-emerald-100 font-black text-xs uppercase tracking-[0.2em]"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (article ? 'Update Artikel' : 'Publish Artikel')}
                    </Button>
                    <Button variant="ghost" onClick={onClose} className="w-full h-10 rounded-xl text-slate-400 font-bold text-xs uppercase">Batal</Button>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function AdminArticles() {
  const [articles, setArticles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pagination, setPagination] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState<any>(null);

  React.useEffect(() => {
    fetchArticles(page);
  }, [page]);

  const fetchArticles = async (targetPage: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/articles?page=${targetPage}`);
      setArticles(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Fetch articles error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (article: any) => {
    if (window.confirm(`Hapus artikel "${article.title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await api.delete(`/admin/articles/${article.id}`);
        fetchArticles(page);
      } catch (err) {
        alert('Gagal menghapus artikel.');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-purple-600" /> Manajemen Konten Edukasi
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Publikasikan artikel kesehatan jantung terverifikasi medis.</p>
        </div>
        <Button onClick={() => { setSelectedArticle(null); setIsModalOpen(true); }} className="h-12 px-6 rounded-2xl shadow-xl shadow-purple-100 bg-purple-600 hover:bg-purple-700 font-black text-xs uppercase tracking-widest">
          <Plus className="w-5 h-5 mr-2" /> Tulis Artikel Baru
        </Button>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
           Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="h-80 bg-slate-50 rounded-[2.5rem] animate-pulse" />
           ))
        ) : articles.length > 0 ? (
          articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group"
            >
              <Card className="rounded-[2.5rem] border-slate-100 overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative">
                <div className="h-48 overflow-hidden relative">
                   <img 
                    src={article.thumbnail || "https://images.unsplash.com/photo-1505751172107-573225a912bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   />
                   <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 border-none shadow-lg">
                        {article.category}
                      </Badge>
                   </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                   <h3 className="text-lg font-black text-slate-900 mb-4 font-display leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
                     {article.title}
                   </h3>
                   
                   <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                         <Clock className="w-3 h-3" /> {new Date(article.created_at).toLocaleDateString('id-ID')}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
                         <CheckCircle2 className="w-3 h-3" /> {article.status}
                      </div>
                   </div>

                   <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex gap-2">
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           onClick={() => { setSelectedArticle(article); setIsModalOpen(true); }}
                           className="w-9 h-9 rounded-xl hover:bg-slate-50 text-slate-400 group-hover:text-slate-600 transition-all"
                         >
                            <Edit className="w-4 h-4" />
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           onClick={() => handleDelete(article)}
                           className="w-9 h-9 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                         >
                            <Trash2 className="w-4 h-4" />
                         </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(`/article/${article.slug}`, '_blank')}
                        className="h-9 px-4 rounded-xl border-slate-100 text-[10px] font-black uppercase tracking-widest"
                      >
                         Preview <Eye className="w-3.5 h-3.5 ml-2" />
                      </Button>
                   </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest">Belum ada artikel diterbitkan.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-4 pt-12">
            <Button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              variant="outline" className="rounded-2xl h-12 w-12 p-0 border-slate-100 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
               {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(p => (
                 <button 
                   key={p}
                   onClick={() => setPage(p)}
                   className={cn(
                     "w-12 h-12 rounded-2xl text-sm font-black transition-all",
                     page === p ? "bg-purple-600 text-white shadow-xl shadow-purple-200 scale-110" : "text-slate-400 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100"
                   )}
                 >
                   {p}
                 </button>
               ))}
            </div>
            <Button 
               disabled={page === pagination.last_page}
               onClick={() => setPage(page + 1)}
               variant="outline" className="rounded-2xl h-12 w-12 p-0 border-slate-100 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
      )}

      <ArticleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchArticles(page)}
        article={selectedArticle}
      />
    </div>
  );
}
