





import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HostForm from './components/forms/HostForm';
import HostList from './pages/HostLast'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Sidebar layout with nested routes */}
        {/* 
        <Route path="/" element={<Layout />}>
          <Route path="UserManagement" element={<UserManagement />} />
          <Route path="PaymentsBilling" element={<PaymentsBilling />} />
          <Route path="Home" element={<Homeview />} />
        </Route> 
        */}

        {/* Direct route to HostForm */}

        <Route path="/HostForm" element={<HostForm />} />
        <Route path="/HostList" element={<HostList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
