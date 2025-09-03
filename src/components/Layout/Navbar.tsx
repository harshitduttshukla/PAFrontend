

function Navbar() {
  return (
    <div>
    <nav className="bg-blue-600 text-white px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-8">
            <button className="hover:text-blue-200 transition-colors">Dashboard</button>
            <button className="hover:text-blue-200 transition-colors">Clients</button>
            <button className="hover:text-blue-200 transition-colors">Invoices</button>
            <button className="hover:text-blue-200 transition-colors">Property Details</button>
            <button className="hover:text-blue-200 transition-colors">Reservation Details</button>
            <button className="hover:text-blue-200 transition-colors">Reports</button>
          </div>
        </div>
      </nav>
      </div>
  )
}

export default Navbar