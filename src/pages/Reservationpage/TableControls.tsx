// TableControls Component
interface TableControlsProps {
  entriesPerPage: number;
  setEntriesPerPage: (value: number) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  totalEntries: number;
}

const TableControls: React.FC<TableControlsProps> = ({
  entriesPerPage,
  setEntriesPerPage,
  searchTerm,
  setSearchTerm,
  totalEntries
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Show</span>
        <select 
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-gray-600">entries (Total: {totalEntries})</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Search:</span>
        <input 
          type="text" 
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search reservations..."
        />
      </div>
    </div>
  );
};


export default TableControls