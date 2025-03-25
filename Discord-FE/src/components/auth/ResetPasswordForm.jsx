const ResetPasswordForm = ({ onSubmit, isDarkMode, t }) => (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="password"
        placeholder={t("Enter new password")}
        className="p-3 rounded-md border outline-none transition"
        style={{
          background: isDarkMode ? "#202225" : "#FFFFFF",
          borderColor: isDarkMode ? "#3a3a3a" : "#CCCCCC",
          color: isDarkMode ? "white" : "#000000",
        }}
      />
      <input
        type="password"
        placeholder={t("Confirm new password")}
        className="p-3 rounded-md border outline-none transition"
        style={{
          background: isDarkMode ? "#202225" : "#FFFFFF",
          borderColor: isDarkMode ? "#3a3a3a" : "#CCCCCC",
          color: isDarkMode ? "white" : "#000000",
        }}
      />
      <button
        type="submit"
        className="font-bold py-2 rounded-md transition"
        style={{
          background: isDarkMode ? "#444" : "#1877F2",
          color: "white",
        }}
      >
        {t('Confirm change password')}
      </button>
    </form>
  );
  
export default ResetPasswordForm;
  