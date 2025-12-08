import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';

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
import Invoicepage from './pages/Invoice'

import Layout from './Layout';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/reservation-list" replace />} />
            <Route path="/HostForm" element={<HostForm />} />
            <Route path="/HostList" element={<HostList />} />
            <Route path="/PincodeManager" element={<PincodeManager />} />
            <Route path="/PropertyForm" element={<PropertyForm />} />
            <Route path="/PropertyLast" element={<PropertyLast />} />
            <Route path="/ClientForm" element={<ClientForm />} />
            <Route path="/ClientLast" element={<ClientLast />} />
            <Route path="/ReservationManagementSystem" element={<ReservationManagementSystem />} />
            <Route path="/reservation-management" element={<ReservationManagementSystem />} />
            <Route path="/ReservationList" element={<ReservationList />} />
            <Route path="/reservation-list" element={<ReservationList />} />
            <Route path="/InvoiceForm" element={<InvoiceForm />} />
            <Route path="/Invoicepage" element={<Invoicepage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
