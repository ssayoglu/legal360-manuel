import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePageNew from "./components/HomePageNew";
import ProcessListNew from "./components/ProcessListNew";
import ProcessFlowWithHeader from "./components/ProcessFlowWithHeader";
import ProcessFlowWithHeaderDebug from "./components/ProcessFlowWithHeaderDebug";
import ProcessFlowWithHeaderDebug2 from "./components/ProcessFlowWithHeaderDebug2";
import IconTest from "./components/IconTest";
import UIComponentTest from "./components/UIComponentTest";
import UIComponentTest2 from "./components/UIComponentTest2";
import CardTest from "./components/CardTest";
import BadgeTest from "./components/BadgeTest";
import CustomComponentTest from "./components/CustomComponentTest";
import TestImports from "./components/TestImports";
import LegalAidPage from "./components/LegalAidPage";
import AboutPage from "./components/AboutPage";
import BlogPage from "./components/BlogPage";
import YargitayPage from "./components/YargitayPage";
import ContactPage from "./components/ContactPage";
import { Toaster } from "./components/ui/toaster";
import { API_CONFIG } from "./config";

// Admin components
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import LegalProcessesAdmin from "./components/admin/LegalProcessesAdmin";
import LegalProcessForm from "./components/admin/LegalProcessForm";
import CalculatorParametersAdmin from "./components/admin/CalculatorParametersAdmin";
import BlogPostsAdmin from "./components/admin/BlogPostsAdmin";
import SupremeCourtDecisionsAdmin from "./components/admin/SupremeCourtDecisionsAdmin";
import ContentPagesAdmin from "./components/admin/ContentPagesAdmin";
import LegalAidAdmin from "./components/admin/LegalAidAdmin";
import BaroManagementAdmin from "./components/admin/BaroManagementAdmin";

function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (token && userData) {
      try {
        const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          setAdminUser(user);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    setCheckingAuth(false);
  };

  const handleAdminLogin = (userData) => {
    setAdminUser(userData);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
  };

  // Protected Route component
  const ProtectedAdminRoute = ({ children }) => {
    if (checkingAuth) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yetkilendirme kontrol ediliyor...</p>
          </div>
        </div>
      );
    }

    if (!adminUser) {
      return <Navigate to="/admin/login" replace />;
    }

    return children;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePageNew />} />
          <Route path="/processes" element={<ProcessListNew />} />
          <Route path="/process/:id" element={<ProcessFlowWithHeader />} />
          <Route path="/test-imports" element={<TestImports />} />
          <Route path="/icon-test" element={<IconTest />} />
          <Route path="/ui-test" element={<UIComponentTest />} />
          <Route path="/ui-test2" element={<UIComponentTest2 />} />
          <Route path="/card-test" element={<CardTest />} />
          <Route path="/badge-test" element={<BadgeTest />} />
          <Route path="/custom-test" element={<CustomComponentTest />} />
          <Route path="/legal-aid" element={<LegalAidPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/yargitay" element={<YargitayPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route 
            path="/admin/login" 
            element={
              adminUser ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <AdminLogin onLogin={handleAdminLogin} />
            } 
          />
          
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout adminUser={adminUser} onLogout={handleAdminLogout} />
            </ProtectedAdminRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard adminUser={adminUser} />} />
            <Route path="legal-processes" element={<LegalProcessesAdmin />} />
            <Route path="legal-processes/new" element={<LegalProcessForm />} />
            <Route path="legal-processes/edit/:id" element={<LegalProcessForm />} />
            <Route path="calculator-parameters" element={<CalculatorParametersAdmin />} />
            <Route path="blog-posts" element={<BlogPostsAdmin />} />
            <Route path="blog-posts/new" element={<div className="p-6"><h1 className="text-2xl font-bold">Blog Post Form</h1><p>Coming Soon</p></div>} />
            <Route path="supreme-court-decisions" element={<SupremeCourtDecisionsAdmin />} />
            <Route path="content-pages" element={<ContentPagesAdmin />} />
            <Route path="legal-aid" element={<LegalAidAdmin />} />
            <Route path="baro-management" element={<BaroManagementAdmin />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;