import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Warned from './warned';
import WFDashboard from './dashboard';

function WFWrapper() {
  const navigate = useNavigate();
  return <WFDashboard onBack={() => navigate('/')} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Warned />} />
        <Route path="/wf" element={<WFWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;