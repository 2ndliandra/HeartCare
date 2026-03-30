import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <Leaf className="h-6 w-6 text-emerald-400" />
                            <span className="font-bold text-xl text-white tracking-tight">AgriTomat</span>
                        </Link>
                        <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
                            Platform asisten digital cerdas yang menjembatani petani tradisional dengan teknologi Machine Learning untuk stabilisasi produksi tomat di Jawa Timur.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-6">Tautan Cepat</h3>
                        <ul className="space-y-4">
                            <li><a href="#fitur" className="hover:text-emerald-400 transition-colors text-sm">Fitur Utama</a></li>
                            <li><a href="#dampak" className="hover:text-emerald-400 transition-colors text-sm">Dampak Strategis</a></li>
                            <li><Link to="/login" className="hover:text-emerald-400 transition-colors text-sm">Login Petani</Link></li>
                            <li><Link to="/register" className="hover:text-emerald-400 transition-colors text-sm">Daftar Akun Baru</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-6">Hubungi Kami</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-emerald-400" />
                                <span>Jawa Timur, Indonesia</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-emerald-400" />
                                <span>kontak@agritomat.id</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-emerald-400" />
                                <span>+62 811 2345 6789</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Agroinformatika Tomat Jatim. Hak Cipta Dilindungi.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
                        <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
