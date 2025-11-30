import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HostForm from './components/forms/HostForm';
import PincodeManager from './pages/PincodeManager';
import PropertyForm from './components/forms/PropertyForm';
import ClientForm from './components/forms/ClientForm';
import ReservationManagementSystem from './components/forms/ReservationManagementSystem';
import InvoiceForm from './components/forms/InvoiceForm';
import HostList from './pages/HostLast'
import PropertyLast from './pages/PropertyLast'
import ClientLast from './pages/ClientLast'
import ReservationList from './pages/ReservationList'
import Layout from './Layout';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/HostForm" element={<HostForm />} />
          <Route path="/HostList" element={<HostList />} />
          <Route path="/PincodeManager" element={<PincodeManager />} />
          <Route path="/PropertyForm" element={<PropertyForm />} />
          <Route path="/PropertyLast" element={<PropertyLast />} />
          <Route path="/ClientForm" element={<ClientForm />} />
          <Route path="/ClientLast" element={<ClientLast />} />
          <Route path="/ReservationManagementSystem" element={<ReservationManagementSystem />} />
          <Route path="/ReservationList" element={<ReservationList />} />
          <Route path="/InvoiceForm" element={<InvoiceForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
