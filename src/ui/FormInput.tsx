// import React from "react";



// interface FormInputProps {
//   label: string;
//   type?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
// }

// const FormInput: React.FC<FormInputProps> = ({
//   label,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
// }) => {
//   return (
//     <div className="flex flex-col">
//       <label className="text-sm font-medium text-gray-600 mb-2">{label}</label>
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
//                    focus:border-blue-500 focus:outline-none 
//                    transition-all duration-300"
//       />
//     </div>
//   );
// };

// export default FormInput;





import React from "react";

const FormInput: React.FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}> = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300"
    />
  </div>
);

export default FormInput;
