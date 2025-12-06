import React, { useState, useEffect } from 'react';
import { Settings, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight, Plus } from 'lucide-react';

interface Invoice {
  id: string;
  status: string;
  pai: string;
  created: string;
  clientName: string;
  amount: string;
}

const Invoicepage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const tabs = ['All', 'Draft', 'Sent', 'Viewed', 'Paid', 'Overdue'];

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/getAllInvoices`);
        if (response.ok) {
          const result = await response.json();
          const mappedInvoices = result.data.map((inv: any) => ({
            id: inv.id,
            status: inv.status,
            pai: inv.invoice_number,
            created: new Date(inv.invoice_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            clientName: inv.invoice_to,
            amount: `₹${inv.grand_total}`
          }));
          setInvoices(mappedInvoices);
        }
      } catch (error) {
        console.error("Failed to fetch invoices", error);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

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
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === tab
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

export default Invoicepage;