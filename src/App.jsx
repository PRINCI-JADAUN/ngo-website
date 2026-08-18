import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { SiteContentProvider } from "./context/SiteContentContext";
import AdminPage from "./pages/AdminPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import StoriesPage from "./pages/StoriesPage";

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return isAdmin ? (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
    </Routes>
  ) : (
    <Layout>
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/gallery"     element={<GalleryPage />} />
        <Route path="/stories"     element={<StoriesPage />} />
        <Route path="/contact"     element={<ContactPage />} />
        <Route path="/about"       element={<Navigate to="/#about"    replace />} />
        <Route path="/programs"    element={<Navigate to="/#programs" replace />} />
        <Route path="/about_us.html"  element={<Navigate to="/#about"    replace />} />
        <Route path="/services.html"  element={<Navigate to="/#programs" replace />} />
        <Route path="/blog.html"      element={<Navigate to="/stories"   replace />} />
        <Route path="/gallery.html"   element={<Navigate to="/gallery"   replace />} />
        <Route path="/contact_us.html" element={<Navigate to="/contact"  replace />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <SiteContentProvider>
      <AppRoutes />
    </SiteContentProvider>
  );
}

export default App;
