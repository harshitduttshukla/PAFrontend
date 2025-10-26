const TableHeader = ({Columns }:any) => {
return (
        <thead className="bg-gray-50">
            <tr>
                {
                    Columns.map((col:any,idx:any) => (
                        <th 
                        key = {idx}
                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                             {col}
                        </th>
                    ))
                }
            </tr>

        </thead>
    )
}

export default TableHeader;