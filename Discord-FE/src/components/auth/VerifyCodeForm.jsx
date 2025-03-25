const VerifyCodeForm = ({ code, handleCodeChange, onSubmit, isDarkMode, t }) => (
    <form onSubmit={onSubmit} className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-9 gap-2 mb-4">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(e, index)}
            className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none transition"
            style={{
              background: isDarkMode ? "#202225" : "#FFFFFF",
              borderColor: isDarkMode ? "#3a3a3a" : "#CCCCCC",
              color: isDarkMode ? "white" : "#000000",
            }}
          />
        ))}
      </div>
      <button
        type="submit"
        className="font-bold py-2 rounded-md transition w-full"
        style={{
          background: isDarkMode ? "#444" : "#1877F2",
          color: "white",
        }}
      >
        {t('Confirm code')}
      </button>
    </form>
  );
  
export default VerifyCodeForm;
  