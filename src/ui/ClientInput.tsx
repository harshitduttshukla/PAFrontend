type clinetprop = {
    label : string;
    name : string;
    value : string;
    type ? : string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

 function ClientInput({label,type = "text",value,onChange,name}:clinetprop) {
  return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={value}
                      onChange={onChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
  )
}

export default ClientInput