import { useTranslation } from "react-i18next";
export default function Settings() {
  const {t} = useTranslation();
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">{t('Settings Page')}</h1>
        <p>{t('Manage your settings here.')}</p>
      </div>
    );
  }
  