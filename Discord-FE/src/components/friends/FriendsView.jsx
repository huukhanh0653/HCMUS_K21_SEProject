import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
export default function FriendsView() {
  const {t} = useTranslation();
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
      {/* Vòng tròn chứa icon X */}
      <div className="w-40 h-40 mb-4 flex items-center justify-center bg-white rounded-full shadow-lg">
        <X size={100} className="text-red-500" />
      </div>

      <p className="text-gray-400 mt-4">{t(`There aren't any online friends now. Please come back later!`)}</p>

      <div className="mt-8 text-gray-300">
        <h2 className="text-xl font-bold mb-2">{t('Active')}</h2>
        <p className="text-gray-400 max-w-md">
          {t(`There isn't any new activity... If your friend have new activities, like playing game or video calling, we will display those activities here!`)}
        </p>
      </div>
    </div>
  );
}
