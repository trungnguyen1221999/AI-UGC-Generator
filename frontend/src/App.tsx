import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Genetator from './pages/Genetator';
import Loading from './pages/Loading';
import MyGenerations from './pages/MyGenerations';
import Result from './pages/Result';

import Community from './pages/Community';
import SoftBackdrop from './components/SoftBackdrop';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';

function App() {
	return (
		<LanguageProvider>
			<BrowserRouter>
				<SoftBackdrop />
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/community" element={<Community />} />
					<Route path="/generate" element={<Genetator />} />
					<Route path="/loading" element={<Loading />} />
					<Route path="/my-generations" element={<MyGenerations />} />
					<Route path="/result/:id" element={<Result />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</LanguageProvider>
	);
}

export default App;