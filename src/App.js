import './App.css';
import { Accounts } from './pages/accounts'
import { Transactions } from './components/transactions'
function App() {
  return (
    <div className="App">
      <Accounts />
      <Transactions />
    </div>
  );
}

export default App;
