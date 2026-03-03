import { useState } from "react";
import useMediaQuery from "./useMediaQuery";

const useSidebar = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
  
  const [collapsed, setCollapsed] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleSidebar = () => {
      setCollapsed(prev => !prev);
    
  };

  return {
    collapsed,
    notificationOpen,
    isDesktop,
    isTablet,
    toggleSidebar,
    setCollapsed,
    setNotificationOpen
  };
};

export default useSidebar;