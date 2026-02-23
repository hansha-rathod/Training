import { useEffect } from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const { darkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply theme attribute to document element
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [darkMode]);

  return <>{children}</>;
};

export default ThemeProvider;
