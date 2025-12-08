import { NavLink, useNavigate } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import { useAuth } from "./context/AuthContext";

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "Host Form", path: "/HostForm" },
  { label: "Host List", path: "/HostList" },
  { label: "Pincode Manager", path: "/PincodeManager" },
  { label: "Property Form", path: "/PropertyForm" },
  { label: "Property Last", path: "/PropertyLast" },
  { label: "Client Form", path: "/ClientForm" },
  { label: "Client Last", path: "/ClientLast" },
  { label: "Reservation Management", path: "/ReservationManagementSystem" },
  { label: "Reservation List", path: "/ReservationList" },
  { label: "Invoice Form", path: "/InvoiceForm" },
  { label: "Invoice Page", path: "/Invoicepage" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className={`
        bg-white h-screen w-64 p-4 shadow-lg overflow-y-auto fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:w-52
      `}>
        <div className="flex justify-between items-center mb-6 ml-4 mt-2">
          <h2 className="text-2xl font-bold text-gray-800">DashBoard</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024 && onClose) {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200 ${isActive
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-700 hover:bg-blue-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 rounded-lg text-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200 border border-red-100"
          >
            <LogOut size={20} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
    </>
  );
}

export default Sidebar;




