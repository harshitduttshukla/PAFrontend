import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HostForm from './components/forms/HostForm';
import PropertyForm from './components/forms/PropertyForm';
import HostList from './pages/HostLast'
import PropertyLast from './pages/PropertyLast'
import Layout from './Layout';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Layout />}>
         
        <Route path="/HostForm" element={<HostForm />} />
        <Route path="/HostList" element={<HostList />} />
        <Route path="/PropertyForm" element={<PropertyForm />} />
        <Route path="/PropertyLast" element={<PropertyLast />} />
        </Route> 
        

        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
