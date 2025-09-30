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
import ContentPageTemplate from "./components/ContentPageTemplate";
import BlogPostTemplate from "./components/BlogPostTemplate";
import SupremeCourtDecisionTemplate from "./components/SupremeCourtDecisionTemplate";
import ContactPage from "./components/ContactPage";
import { Toaster } from "./components/ui/toaster";
import { API_CONFIG } from "./config";
import Footer from "./components/Footer";

// Admin components
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import LegalProcessesAdmin from "./components/admin/LegalProcessesAdmin";
import LegalProcessForm from "./components/admin/LegalProcessForm";
import CalculatorParametersAdmin from "./components/admin/CalculatorParametersAdmin";
import BlogPostsAdmin from "./components/admin/BlogPostsAdmin";
import BlogPostEdit from "./components/admin/BlogPostEdit";
import SupremeCourtDecisionsAdmin from "./components/admin/SupremeCourtDecisionsAdmin";
import ContentPagesAdmin from "./components/admin/ContentPagesAdmin";
import SiteSettingsAdmin from "./components/admin/SiteSettingsAdmin";
import AboutPageContentAdmin from "./components/admin/AboutPageContentAdmin";
import ContactPageContentAdmin from "./components/admin/ContactPageContentAdmin";
import HomePageContentAdmin from "./components/admin/HomePageContentAdmin";
import LegalAidAdmin from "./components/admin/LegalAidAdmin";
import BaroManagementAdmin from "./components/admin/BaroManagementAdmin";
import AdsSettingsAdmin from "./components/admin/AdsSettingsAdmin";

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
          <Route path="/" element={<><HomePageNew /><Footer /></>} />
          <Route path="/hukuki-surecler" element={<><ProcessListNew /><Footer /></>} />
          <Route path="/processes" element={<Navigate to="/hukuki-surecler" replace />} />
          <Route path="/hukuki-surec/:id" element={<><ProcessFlowWithHeader /><Footer /></>} />
          <Route path="/process/:id" element={<Navigate to="/hukuki-surec/:id" replace />} />
          <Route path="/test-imports" element={<><TestImports /><Footer /></>} />
          <Route path="/icon-test" element={<><IconTest /><Footer /></>} />
          <Route path="/ui-test" element={<><UIComponentTest /><Footer /></>} />
          <Route path="/ui-test2" element={<><UIComponentTest2 /><Footer /></>} />
          <Route path="/card-test" element={<><CardTest /><Footer /></>} />
          <Route path="/badge-test" element={<><BadgeTest /><Footer /></>} />
          <Route path="/custom-test" element={<><CustomComponentTest /><Footer /></>} />
          <Route path="/adli-yardim-hizmetleri" element={<><LegalAidPage /><Footer /></>} />
          <Route path="/legal-aid" element={<Navigate to="/adli-yardim-hizmetleri" replace />} />
          <Route path="/hakkimizda" element={<><AboutPage /><Footer /></>} />
          <Route path="/about" element={<Navigate to="/hakkimizda" replace />} />
          <Route path="/blog" element={<><BlogPage /><Footer /></>} />
          <Route path="/blog/:slug" element={<><BlogPostTemplate /><Footer /></>} />
          <Route path="/page/:slug" element={<><ContentPageTemplate /><Footer /></>} />
          <Route path="/yargitay-kararlari" element={<><YargitayPage /><Footer /></>} />
          <Route path="/yargitay" element={<Navigate to="/yargitay-kararlari" replace />} />
          <Route path="/yargitay-kararlari/:id" element={<><SupremeCourtDecisionTemplate /><Footer /></>} />
          <Route path="/yargitay/:id" element={<><SupremeCourtDecisionTemplate /><Footer /></>} />
          <Route path="/adli-yardim" element={<><LegalAidPage /><Footer /></>} />
          <Route path="/iletisim" element={<><ContactPage /><Footer /></>} />
          <Route path="/contact" element={<Navigate to="/iletisim" replace />} />
          {/* Root-level published content pages (placed last among public routes) */}
          <Route path=":slug" element={<><ContentPageTemplate /><Footer /></>} />

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
            <Route path="blog-posts/new" element={<BlogPostEdit />} />
            <Route path="blog-posts/edit/:id" element={<BlogPostEdit />} />
            <Route path="supreme-court-decisions" element={<SupremeCourtDecisionsAdmin />} />
            <Route path="content-pages" element={<ContentPagesAdmin />} />
            <Route path="site-settings" element={<SiteSettingsAdmin />} />
            <Route path="about-content" element={<AboutPageContentAdmin />} />
            <Route path="contact-content" element={<ContactPageContentAdmin />} />
            <Route path="home-content" element={<HomePageContentAdmin />} />
            <Route path="page-contents" element={<AboutPageContentAdmin />} />
            <Route path="legal-aid" element={<LegalAidAdmin />} />
            <Route path="baro-management" element={<BaroManagementAdmin />} />
            <Route path="ads-settings" element={<AdsSettingsAdmin />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;