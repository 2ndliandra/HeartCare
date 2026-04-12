import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/home';
import './App.css';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import RiwayatPemeriksaanPage from './pages/UserPage/RiwayatPemeriksaan';
import RekomendasiMedisPage from './pages/UserPage/RekomendasiMedis';
import CekKesehatanPage from './pages/UserPage/CekKesehatan';
import HasilPrediksiPage from './pages/UserPage/HasilPrediksi';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticlesPage/ArticleDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/articles" element={<ArticlesPage />} />
                <Route path="/article/:slug" element={<ArticleDetailPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminPage />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                    <Route path="/user" element={<UserPage />} />
                    <Route path="/user/riwayat" element={<RiwayatPemeriksaanPage />} />
                    <Route path="/user/rekomendasi" element={<RekomendasiMedisPage />} />
                    <Route path="/user/cek-kesehatan" element={<CekKesehatanPage />} />
                    <Route path="/user/hasil-prediksi" element={<HasilPrediksiPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
