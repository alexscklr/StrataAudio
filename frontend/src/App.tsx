import Header from './layout/Header/Header';
import "@/assets/App.css";
import Main from './layout/Main/Main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import VideoCatalogPage from './pages/VideoCatalogPage';
import ConsentPage from './pages/ConsentPage';
import WatchPage from './pages/WatchPage';
import EndSurveyPage from './pages/EndSurveyPage';
import Footer from './layout/Footer/Footer';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Main>
        <Routes>
          <Route path="/" element={<ConsentPage />} />
          <Route path="/videos" element={<VideoCatalogPage />} />
          <Route path="/videos/:videoid" element={<WatchPage />} />
          <Route path="/endumfrage" element={<EndSurveyPage />} />
        </Routes>
      </Main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;