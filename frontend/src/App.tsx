import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Genetator from './pages/Genetator';
import NotFound from './pages/NotFound';
import MyGenerations from './pages/MyGenerations';
import Result from './pages/Result';
import Community from './pages/Community';
import SoftBackdrop from './components/SoftBackdrop';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import Plan from './pages/Plan';
import { ClerkProvider } from '@clerk/clerk-react';

function App() {
    return (
        <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
            <LanguageProvider>
                <BrowserRouter>
                    <SoftBackdrop />
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/generate" element={<Genetator />} />
                        <Route path="/my-generations" element={<MyGenerations />} />
                        <Route path="/plan" element={<Plan />} />
                        <Route path="/result/:id" element={<Result />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
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