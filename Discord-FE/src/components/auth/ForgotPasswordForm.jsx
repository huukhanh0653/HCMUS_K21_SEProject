const ForgotPasswordForm = ({ email, setEmail, onSubmit, isDarkMode, t }) => (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder={t("Enter email")}
        className="p-3 rounded-md border outline-none transition"
        style={{
          background: isDarkMode ? "#202225" : "#FFFFFF",
          borderColor: isDarkMode ? "#3a3a3a" : "#CCCCCC",
          color: isDarkMode ? "white" : "#000000",
        }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        className="font-bold py-2 rounded-md transition"
        style={{
          background: isDarkMode ? "#444" : "#1877F2",
          color: "white",
        }}
      >
        {t('Confirm')}
      </button>
    </form>
  );
  
export default ForgotPasswordForm;
  