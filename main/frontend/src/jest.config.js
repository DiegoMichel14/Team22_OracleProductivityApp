module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    // Ignora archivos de estilo como CSS, SCSS, etc.
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
