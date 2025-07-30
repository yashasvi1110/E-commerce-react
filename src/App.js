import './App.css';
import Pages from './components/pages/Pages';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Pages />
      </AuthProvider>
    </div>
  );
}

export default App;
