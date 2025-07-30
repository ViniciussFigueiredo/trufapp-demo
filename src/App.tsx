import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Main } from './views/main/main'
import { NavBar } from './views/navbar/navbar'
import { MySales } from './views/mySell/mySell';
import { Month } from './views/month/month';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/vendas" element={<MySales />} />
        <Route path="/mensal" element={<Month />} />
      </Routes>
    </Router>
  )
}

export default App
