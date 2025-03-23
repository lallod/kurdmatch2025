
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AppRoutes from '@/components/routing/AppRoutes';
import AppInitializer from '@/components/AppInitializer';
import './App.css';

function App() {
  return (
    <Router>
      <AppInitializer />
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </Router>
  );
}

export default App;
