import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Generator from "./pages/Generator";
import NotFound from "./pages/NotFound";
import MyGenerations from "./pages/MyGenerations";
import Result from "./pages/Result";
import Community from "./pages/Community";
import SoftBackdrop from "./components/SoftBackdrop";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import Plan from "./pages/Plan";
import { ClerkProvider } from "@clerk/clerk-react";
import DashboardLayout from "./components/DashboardLayout";

// Routes that use the default layout (Navbar + Footer)
// Routes dùng layout mặc định (Navbar + Footer)
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <SoftBackdrop />
    <Navbar />
    {children}
    <Footer />
  </>
);

// Redirect to dashboard once after login — uses sessionStorage to only fire once per session
// Redirect về dashboard 1 lần sau khi login — dùng sessionStorage để không redirect mãi
const AuthRedirect = () => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && !sessionStorage.getItem("redirected")) {
      sessionStorage.setItem("redirected", "true");
      navigate("/dashboard");
    }
  }, [isSignedIn, isLoaded]);

  return null;
};

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <LanguageProvider>
        <BrowserRouter>
          {/* Runs on every render — handles post-login redirect */}
          {/* Chạy ở mọi route — xử lý redirect sau khi login */}
          <AuthRedirect />

          <Routes>
            {/* ── Main layout routes — Navbar + Footer ── */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/community"
              element={
                <MainLayout>
                  <Community />
                </MainLayout>
              }
            />
            <Route
              path="/my-generations"
              element={
                <MainLayout>
                  <MyGenerations />
                </MainLayout>
              }
            />
            <Route
              path="/plan"
              element={
                <MainLayout>
                  <Plan />
                </MainLayout>
              }
            />

            {/* ── Dashboard layout routes — Sidebar only, no Navbar/Footer ── */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route
                index
                element={
                  <div className="text-white/50 p-8">
                    Select a page from the sidebar.
                  </div>
                }
              />
              <Route path="generate" element={<Generator />} />
              <Route path="result/:id" element={<Result />} />
              <Route path="my-generations" element={<MyGenerations />} />
              <Route path="community" element={<Community />} />
              <Route path="plan" element={<Plan />} />
            </Route>

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </BrowserRouter>
      </LanguageProvider>
    </ClerkProvider>
  );
}

export default App;
