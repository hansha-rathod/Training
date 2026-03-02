import { useState } from "react";
import useMediaQuery from "./useMediaQuery";

const useSidebar = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleSidebar = () => {
    if (isDesktop) {
      setCollapsed(prev => !prev);
    } else {
      setMobileOpen(prev => !prev);
    }
  };

  return {
    collapsed,
    mobileOpen,
    notificationOpen,
    isDesktop,
    isTablet,
    toggleSidebar,
    setMobileOpen,
    setCollapsed,
    setNotificationOpen
  };
};

export default useSidebar;