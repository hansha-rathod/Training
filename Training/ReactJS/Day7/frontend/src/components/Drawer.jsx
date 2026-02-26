import { useEffect } from "react";

const Drawer = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={onClose}></div>
      <div style={styles.drawer}>
        <div style={styles.drawerHeader}>
          <h2 style={styles.drawerTitle}>{title}</h2>
          <button onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>
        <div style={styles.drawerContent}>{children}</div>
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "400px",
    backgroundColor: "white",
    boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
    zIndex: 1001,
    display: "flex",
    flexDirection: "column",
    animation: "slideIn 0.3s ease-out",
  },
  drawerHeader: {
    padding: "20px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawerTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#333",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
    padding: "0",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
  },
  drawerContent: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
  },
};

export default Drawer;
