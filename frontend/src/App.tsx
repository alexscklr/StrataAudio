import Header from './layout/Header/Header';
import "@/assets/App.css";
import Main from './layout/Main/Main';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import VideoCatalogPage from './pages/VideoCatalogPage';
import ConsentPage from './pages/ConsentPage';
import WatchPage from './pages/WatchPage';
import EndSurveyPage from './pages/EndSurveyPage';
import DemographicsPage from './pages/DemographicsPage';
import Footer from './layout/Footer/Footer';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { AdminRoute } from './features/auth/components/AdminRoute';
import DemographicsRequiredRoute from './features/analytics/components/DemographicsRequiredRoute';
import EndSurveyRequiredRoute from './features/analytics/components/EndSurveyRequiredRoute';
import ImprintPage from './pages/ImprintPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import UploadPage from './pages/UploadPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function App() {

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Main>
        <Routes>
          <Route path="/" element={<ConsentPage />} />
          <Route path="/demografie" element={<ProtectedRoute><DemographicsPage /></ProtectedRoute>} />
          <Route path="/videos" element={<ProtectedRoute><DemographicsRequiredRoute><VideoCatalogPage /></DemographicsRequiredRoute></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/videos/:videoid" element={<ProtectedRoute><DemographicsRequiredRoute><WatchPage /></DemographicsRequiredRoute></ProtectedRoute>} />
          <Route path="/endumfrage" element={<ProtectedRoute><DemographicsRequiredRoute><EndSurveyRequiredRoute><EndSurveyPage /></EndSurveyRequiredRoute></DemographicsRequiredRoute></ProtectedRoute>} />
          <Route path="/impressum" element={<ImprintPage />} />
          <Route path="/datenschutz" element={<PrivacyPolicyPage />} />
        </Routes>
      </Main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;