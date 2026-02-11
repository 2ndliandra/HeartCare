import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/home';
import './App.css';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminPage />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                    <Route path="/user" element={<UserPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
