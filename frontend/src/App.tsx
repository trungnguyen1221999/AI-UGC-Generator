import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SoftBackdrop from './components/SoftBackdrop';
import Footer from './components/Footer';

function App() {
	return (
		<BrowserRouter>
			<SoftBackdrop />
			<Navbar />
			<Home />
			<Footer />
		</BrowserRouter>
	);
}
export default App;