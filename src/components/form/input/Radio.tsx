import React from "react";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;      // Unique ID
  label: string;   // Label
  className?: string;
}

const Radio: React.FC<RadioProps> = ({
  id,
  label,
  className = "",
  ...props // ← supaya support onChange, checked, name, value dari register()
}) => {
  return (
    <label
      htmlFor={id}
      className={`relative flex cursor-pointer select-none items-center gap-3 text-sm font-medium
        ${props.disabled
          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
          : "text-gray-700 dark:text-gray-400"}
        ${className}`}
    >
      <input
        id={id}
        type="radio"
        className="sr-only"
        {...props} // 🔥 checked, onChange, name, value otomatis masuk
      />

      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] 
          ${props.checked
            ? "border-brand-500 bg-brand-500"
            : "bg-transparent border-gray-300 dark:border-gray-700"}
          ${props.disabled
            ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700"
            : ""}`}
      >
        <span
          className={`h-2 w-2 rounded-full bg-white ${props.checked ? "block" : "hidden"}`}
        />
      </span>

      {label}
    </label>
  );
};

export default Radio;
