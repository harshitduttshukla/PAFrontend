import React, { useState } from 'react';
import { ChevronDown, Settings, HelpCircle, User, LogOut, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight, Plus } from 'lucide-react';

interface Invoice {
  id: string;
  status: string;
  pai: string;
  created: string;
  clientName: string;
  amount: string;
}

const InvoiceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const invoices: Invoice[] = [
    { id: '1', status: 'Draft', pai: 'PAI22060517', created: '06 Jun, 2022', clientName: 'Shadowfax Technologies Pvt Ltd, Bhiwandi, Thana District', amount: '₹31,360.00' },
    { id: '2', status: 'Draft', pai: 'PAI22060516', created: '06 Jun, 2022', clientName: 'Northern Arc Capital Limited', amount: '₹10,752.00' },
    { id: '3', status: 'Draft', pai: 'PAI22060515', created: '06 Jun, 2022', clientName: 'Northern Arc Capital Limited', amount: '₹75,264.00' },
    { id: '4', status: 'Draft', pai: 'PAI22060514', created: '05 Jun, 2022', clientName: 'M MOSER DESIGN ASSOCIATES INDIA PVT LTD, Mumabi', amount: '₹19,600.00' },
    { id: '5', status: 'Draft', pai: 'PAI22060513', created: '02 Jun, 2022', clientName: 'Shadowfax Technologies Pvt Ltd, Bhiwandi, Thana District', amount: '₹167,440.00' },
    { id: '6', status: 'Draft', pai: 'PAI22050512', created: '30 May, 2022', clientName: 'Hindon India Pvt. Ltd., Delhi', amount: '₹11,200.00' },
    { id: '7', status: 'Draft', pai: 'PAI22050511', created: '30 May, 2022', clientName: 'M MOSER DESIGN ASSOCIATES INDIA PVT LTD, Mumabi', amount: '₹23,520.00' },
    { id: '8', status: 'Draft', pai: 'PAI22050510', created: '23 May, 2022', clientName: 'Intertrustvietos Corporate & Fund Services Pvt Ltd, Mumbai', amount: '₹31,360.00' },
    { id: '9', status: 'Draft', pai: 'PAI22050509', created: '23 May, 2022', clientName: 'Elegance Enterprises', amount: '₹19,600.00' },
    { id: '10', status: 'Draft', pai: 'PAI22050508', created: '20 May, 2022', clientName: 'M MOSER DESIGN ASSOCIATES INDIA PVT LTD, Mumabi', amount: '₹15,680.00' },
    { id: '11', status: 'Draft', pai: 'PAI22050507', created: '19 May, 2022', clientName: 'Northern Arc Capital Limited', amount: '₹10,752.00' },
    { id: '12', status: 'Draft', pai: 'PAI22050506', created: '07 May, 2022', clientName: 'Northern Arc Capital Limited', amount: '₹25,088.00' },
  ];

  const tabs = ['All', 'Draft', 'Sent', 'Viewed', 'Paid', 'Overdue'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white px-6 py-3">
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="font-medium">Dashboard</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="font-medium">Clients</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="font-medium">Invoices</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="font-medium">Property & Reservation</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="font-medium">Apartment Bills</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="font-medium">Reports</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </nav>
          
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Filter Invoices"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-gray-800 px-4 py-1.5 rounded border-none outline-none w-64"
            />
            <HelpCircle className="w-5 h-5 cursor-pointer" />
            <Settings className="w-5 h-5 cursor-pointer" />
            <User className="w-5 h-5 cursor-pointer" />
            <LogOut className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Invoices</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white border rounded px-3 py-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-1 bg-white border rounded">
              <button className="p-2 hover:bg-gray-100">
                <ChevronsLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100">
                <ChevronsRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="font-medium">New</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">PAI</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Created</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Client Name</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-center px-6 py-3 text-sm font-semibold text-gray-700">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm">
                      {invoice.status}
                      <span className="ml-2">📋</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a href="#" className="text-blue-500 hover:underline font-medium">
                      {invoice.pai}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{invoice.created}</td>
                  <td className="px-6 py-4">
                    <a href="#" className="text-blue-500 hover:underline">
                      {invoice.clientName}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-800">{invoice.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-colors">
                      <Settings className="w-4 h-4 mr-1" />
                      Options
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDashboard;