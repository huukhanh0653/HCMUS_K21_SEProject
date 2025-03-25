import { useTranslation } from "react-i18next";
export default function Profile() {
  const {t} = useTranslation();
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">{t('Profile Page')}</h1>
        <p>{t('Welcome to your profile!')}</p>
      </div>
    );
  }
  