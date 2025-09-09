

type tableBodyProps = {
    value: string;

}

function Tablebody({value} : tableBodyProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {value}
    </td>
  )
}

export default Tablebody;