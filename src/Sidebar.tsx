import { NavLink } from "react-router-dom";

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
  

];

function Sidebar() {
  return (
    <div className=" h-screen w-50 p-4 shadow-lg overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 ml-4 text-gray-800 ">DashBoard</h2>

      <div className="space-y-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-700 hover:bg-blue-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;




