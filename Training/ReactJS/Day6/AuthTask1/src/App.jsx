import AppRouter from './router/AppRouter';
import { useAuthSync } from './hooks/useAuthSync';

const App = () => {
  useAuthSync(); // enables multi-tab logout sync

  return <AppRouter />;
};

export default App;