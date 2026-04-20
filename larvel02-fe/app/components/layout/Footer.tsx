// @ts-nocheck
import * as React from "react"
import { Link } from "react-router-dom"
import { HeartPulse, Github, Twitter, Linkedin, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-display">
                HeartPredict
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Platform prediksi risiko jantung berbasis AI untuk deteksi dini dan pemantauan kesehatan yang cerdas.
            </p>
          </div>

          <div className="col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Produk</h4>
            <ul className="space-y-2">
              <li><Link to="/user/cek-kesehatan" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Prediksi AI</Link></li>
              <li><Link to="/user/konsultasi" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Konsultasi</Link></li>
              <li><Link to="/articles" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Artikel</Link></li>
              <li><Link to="/about" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Bantuan</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Kontak</Link></li>
              <li><Link to="/privacy" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/terms" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Ikuti Kami</h4>
            <div className="flex gap-3">
              {[Facebook, Twitter, Github, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 HeartPredict. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
