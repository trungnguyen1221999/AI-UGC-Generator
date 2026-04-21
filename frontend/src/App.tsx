import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SoftBackdrop from './components/SoftBackdrop';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';


function AppContent() {
	return (
		<>
			<SoftBackdrop />
			<Navbar />
			<Home />
			<Footer />
		</>
	);
}

function App() {
	return (
		<LanguageProvider>
			<BrowserRouter>
				<AppContent />
			</BrowserRouter>
		</LanguageProvider>
	);
}

export default App;