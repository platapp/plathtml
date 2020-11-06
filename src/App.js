import './App.css';

import { Accounts } from './pages/accounts'
import { Transactions } from './components/transactions'
import Container from '@material-ui/core/Container'

function App() {
  return (
    <Container maxWidth="sm">
      <Accounts />
      <Transactions />
    </Container>
  );
}

export default App;
