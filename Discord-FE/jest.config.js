export default {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "^.+\\.svg$": "jest-transform-stub",
  },
  testEnvironment: "jest-environment-jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  transformIgnorePatterns: [
    "/node_modules/(?!(.*)/)", // Transform all modules in node_modules
    "/node_modules/(?!(@babel/runtime|lucide-react|@radix-ui)/)", // Transform all necessary modules
  ],
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS files
  },
};
