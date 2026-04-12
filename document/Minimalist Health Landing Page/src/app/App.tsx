import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Heart, Activity, Clock, TrendingUp, ShieldCheck, LineChart, UserCircle, FileText, Stethoscope } from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "features", "benefit", "articles", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold text-foreground">HeartPredict</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {["Home", "About", "Features", "Benefit", "Articles", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm transition-colors ${
                    activeSection === item.toLowerCase()
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <img
            src="https://images.unsplash.com/photo-1659353887977-c310d90c751a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBtZWRpY2FsJTIwaGVhbHRoJTIwaGVhcnQlMjBoZWFsdGhjYXJlJTIwbW9kZXJufGVufDF8fHx8MTc3NTk4MDI2OHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Healthcare professional"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
                Deteksi Dini<br />Penyakit Jantung
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Sistem prediksi berbasis AI untuk membantu Anda memantau risiko penyakit jantung secara mandiri dan akurat.
              </p>
              <motion.button
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 10px 25px rgba(37, 99, 235, 0.3)",
                    "0 10px 35px rgba(37, 99, 235, 0.5)",
                    "0 10px 25px rgba(37, 99, 235, 0.3)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <Activity className="w-5 h-5" />
                Mulai Pengecekan
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefit" className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Manfaat HeartPredict</h2>
            <p className="text-lg text-muted-foreground">Solusi kesehatan jantung yang mudah diakses</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <UserCircle className="w-12 h-12 text-primary" />,
                title: "Akses Mudah",
                description: "Mempermudah akses masyarakat terhadap informasi risiko penyakit jantung.",
              },
              {
                icon: <Activity className="w-12 h-12 text-primary" />,
                title: "Pemantauan Mandiri",
                description: "Membantu pengguna dalam memantau kondisi kesehatan secara mandiri.",
              },
              {
                icon: <Stethoscope className="w-12 h-12 text-primary" />,
                title: "Deteksi Awal",
                description: "Menjadi alat bantu awal sebelum melakukan pemeriksaan lebih lanjut ke tenaga medis.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1762768767074-e491f1eebdfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFydCUyMGhlYWx0aCUyMG1vbml0b3JpbmclMjBmaXRuZXNzJTIwd2VsbG5lc3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NTk4MDI3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Health monitoring"
                className="rounded-2xl shadow-2xl w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-foreground mb-6">Tentang HeartPredict</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Penyakit jantung merupakan salah satu penyebab kematian tertinggi di dunia. Salah satu
                  permasalahan utama dalam penanganan penyakit jantung adalah keterlambatan dalam melakukan
                  diagnosis dini, sehingga banyak kasus baru terdeteksi ketika kondisi sudah cukup parah.
                </p>
                <p>
                  Berdasarkan permasalahan tersebut, dirancang sebuah sistem prediksi penyakit jantung berbasis
                  web dan mobile yang bertujuan untuk membantu pengguna dalam melakukan deteksi dini terhadap
                  risiko penyakit jantung. Sistem ini memungkinkan pengguna untuk memasukkan data kesehatan secara
                  mandiri, kemudian sistem akan mengolah data tersebut dan memberikan hasil prediksi risiko.
                </p>
                <p>
                  Aplikasi ini memiliki dua jenis pengguna (role), yaitu admin dan user. Admin bertugas mengelola
                  sistem, data, serta memantau aktivitas pengguna, sedangkan user menggunakan fitur utama seperti
                  pengecekan kesehatan, melihat hasil prediksi, serta mendapatkan rekomendasi.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Fitur Unggulan</h2>
            <p className="text-lg text-muted-foreground">Sistem lengkap untuk pemantauan kesehatan jantung Anda</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <LineChart className="w-10 h-10 text-primary" />,
                title: "Dashboard",
                description: "Informasi kesehatan terbaru dan grafik hasil pengecekan kesehatan secara berkala.",
              },
              {
                icon: <Activity className="w-10 h-10 text-primary" />,
                title: "Cek Kesehatan",
                description: "Input data seperti usia, tekanan darah, kolesterol, detak jantung, dan riwayat penyakit untuk prediksi risiko.",
              },
              {
                icon: <FileText className="w-10 h-10 text-primary" />,
                title: "Rekomendasi",
                description: "Saran pola hidup sehat, anjuran olahraga, dan rekomendasi pemeriksaan lanjutan.",
              },
              {
                icon: <Clock className="w-10 h-10 text-primary" />,
                title: "Historis",
                description: "Pantau perkembangan kondisi kesehatan dari waktu ke waktu melalui data pengecekan sebelumnya.",
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-primary" />,
                title: "Manajemen Admin",
                description: "Kelola data pengguna, dataset, dan lihat laporan penggunaan sistem dengan visualisasi lengkap.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl hover:shadow-xl transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Artikel Kesehatan</h2>
            <p className="text-lg text-muted-foreground">Informasi dan tips kesehatan jantung terkini</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1773399452188-a42e29543bf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxoZWFydCUyMGhlYWx0aCUyMG1vbml0b3JpbmclMjBmaXRuZXNzJTIwd2VsbG5lc3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NTk4MDI3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
                title: "Tips Menjaga Kesehatan Jantung",
                date: "12 April 2026",
                excerpt: "Pelajari cara mudah menjaga kesehatan jantung melalui pola hidup sehat dan olahraga teratur.",
              },
              {
                image: "https://images.unsplash.com/photo-1659366100463-9e29a63adcc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxoZWFydCUyMGhlYWx0aCUyMG1vbml0b3JpbmclMjBmaXRuZXNzJTIwd2VsbG5lc3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NTk4MDI3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
                title: "Pentingnya Deteksi Dini",
                date: "10 April 2026",
                excerpt: "Mengapa deteksi dini penyakit jantung dapat menyelamatkan nyawa Anda.",
              },
              {
                image: "https://images.unsplash.com/photo-1596236100223-f3c656de3038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxoZWFydCUyMGhlYWx0aCUyMG1vbml0b3JpbmclMjBmaXRuZXNzJTIwd2VsbG5lc3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NTk4MDI3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
                title: "Teknologi dalam Pemantauan Kesehatan",
                date: "8 April 2026",
                excerpt: "Bagaimana teknologi AI membantu dalam prediksi dan pencegahan penyakit jantung.",
              },
            ].map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-primary mb-2">{article.date}</p>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{article.title}</h3>
                  <p className="text-muted-foreground">{article.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-foreground text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-8 h-8 text-primary" />
                <span className="text-xl font-semibold">HeartPredict</span>
              </div>
              <p className="text-gray-400">
                Sistem prediksi penyakit jantung berbasis AI untuk deteksi dini dan pemantauan kesehatan.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-400">
                <p>Email: info@heartpredict.com</p>
                <p>Telp: +62 812-3456-7890</p>
                <p>WhatsApp: +62 812-3456-7890</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Alamat</h4>
              <p className="text-gray-400">
                Jl. Kesehatan No. 123<br />
                Jakarta Selatan 12345<br />
                Indonesia
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navigasi</h4>
              <div className="space-y-2">
                {["Home", "About", "Features", "Benefit", "Articles"].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 HeartPredict. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}