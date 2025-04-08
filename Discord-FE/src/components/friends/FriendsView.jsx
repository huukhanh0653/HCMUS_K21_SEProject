import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../layout/ThemeProvider";

export default function FriendsView() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
      {/* Icon thông báo */}
      <div className={`w-40 h-40 mb-4 flex items-center justify-center rounded-full shadow-lg 
        ${isDarkMode 
          ? "bg-white" 
          : "bg-black/20 dark:bg-black/20"}`
      }>
        <X size={100} className="text-red-500" />
      </div>

      <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        {t("There aren't any online friends now. Please come back later!")}
      </p>

      <div className="mt-8">
        <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-[#333333]"}`}>
          {t('Active')}
        </h2>
        <p className={`max-w-md ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {t("There isn't any new activity... If your friend have new activities, like playing game or video calling, we will display those activities here!")}
        </p>
      </div>
    </div>
  );
}
