import { Eye, Trash2 } from "lucide-react";

export default function ShowFile({ files, onRemoveFile, onFileSelect }) {
  if (files.length === 0) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className="bg-[#2f3136] p-2 rounded-lg flex gap-2"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {files.map((file, index) => (
        <div key={index} className="relative w-24 h-28 bg-[#404249] p-2 rounded-lg flex flex-col items-center">
          <div className="w-12 h-16 bg-gray-300 rounded-md" />
          <p className="text-xs text-gray-200 mt-1 truncate w-full">{file.name}</p>
          <div className="absolute top-1 right-1 flex gap-1">
            <button className="p-1 bg-gray-700 rounded" onClick={() => window.open(URL.createObjectURL(file))}>
              <Eye size={14} className="text-white" />
            </button>
            <button className="p-1 bg-red-600 rounded" onClick={() => onRemoveFile(file.name)}>
              <Trash2 size={14} className="text-white" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
