import { useState } from "react";

export function Switch({ checked, onCheckedChange }) {
  const [isChecked, setIsChecked] = useState(checked);

  const toggleSwitch = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onCheckedChange) {
      onCheckedChange(newValue);
    }
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isChecked}
        onChange={toggleSwitch}
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition"></div>
      <div
        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
          isChecked ? "translate-x-5" : ""
        }`}
      ></div>
    </label>
  );
}
