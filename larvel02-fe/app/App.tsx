import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/home';
import './App.css';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import AdminDashboard from './pages/AdminPage/AdminDashboard';
import AdminUsers from './pages/AdminPage/AdminUsers';
import AdminArticles from './pages/AdminPage/AdminArticles';
import AdminCategories from './pages/AdminPage/AdminCategories';
import AdminDatasets from './pages/AdminPage/AdminDatasets';

import UserPage from './pages/UserPage';
import RiwayatPemeriksaanPage from './pages/UserPage/RiwayatPemeriksaan';
import RekomendasiMedisPage from './pages/UserPage/RekomendasiMedis';
import CekKesehatanPage from './pages/UserPage/CekKesehatan';
import HasilPrediksiPage from './pages/UserPage/HasilPrediksi';
import ChatConsultationPage from './pages/UserPage/ChatConsultation';
import ProfilePage from './pages/UserPage/Profil';

import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticlesPage/ArticleDetail';

import ProtectedRoute from './components/ProtectedRoute';
import { UserLayout } from './components/layout/UserLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { PublicLayout } from './components/layout/PublicLayout';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/articles" element={<ArticlesPage />} />
                    <Route path="/article/:slug" element={<ArticleDetailPage />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<AdminUsers />} />
                        <Route path="/admin/articles" element={<AdminArticles />} />
                        <Route path="/admin/categories" element={<AdminCategories />} />
                        <Route path="/admin/datasets" element={<AdminDatasets />} />
                    </Route>
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                    {/* Routes using UserLayout */}
                    <Route element={<UserLayout />}>
                        <Route path="/user" element={<UserPage />} />
                        <Route path="/user/konsultasi" element={<ChatConsultationPage />} />
                        <Route path="/user/riwayat" element={<RiwayatPemeriksaanPage />} />
                        <Route path="/user/rekomendasi" element={<RekomendasiMedisPage />} />
                        <Route path="/user/cek-kesehatan" element={<CekKesehatanPage />} />
                        <Route path="/user/hasil-prediksi" element={<HasilPrediksiPage />} />
                        <Route path="/user/profile" element={<ProfilePage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
