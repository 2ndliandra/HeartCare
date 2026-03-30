import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                                <Leaf className="h-6 w-6 text-primary" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900">Agri<span className="text-primary">Tomat</span></span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#fitur" className="text-slate-600 hover:text-primary transition-colors font-medium text-sm">Fitur Utama</a>
                        <a href="#dampak" className="text-slate-600 hover:text-primary transition-colors font-medium text-sm">Dampak</a>
                        <Link to="/login" className="text-slate-600 hover:text-primary transition-colors font-medium text-sm">Masuk Sistem</Link>
                        <Link to="/register" className="bg-primary text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                            Mulai Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
