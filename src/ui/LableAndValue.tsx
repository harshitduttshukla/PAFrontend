

type LableAndValueProp = {
    value : string | number;
    lable : string;
}

function LableAndValue({value,lable} : LableAndValueProp) {
  return (
    <div className="flex flex-col sm:flex-row">
                <span className="font-medium text-gray-700 w-full sm:w-32 mb-1 sm:mb-0">{lable}</span>
                <span className="text-gray-600">: {value}</span>
              </div>
  )
}

export default LableAndValue