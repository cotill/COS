import { useState, useCallback } from "react";
interface notification {
  id: string;
  type: "error" | "warning" | "success" | "partial-success";
  text: string | JSX.Element[];
}

const useNotifcations = () => {
  const [notifications, setNotifications] = useState<Array<notification>>([]);
  // Add a new notification
  const addNotification = (type: "error" | "warning" | "success" | "partial-success", text: string | JSX.Element[]) => {
    const newNotification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Create a unique ID
      type,
      text,
    };

    setNotifications((prev) => [...prev, newNotification]);
    return newNotification.id; // Return the ID in case you need to reference this specific notification
  };

  // Remove a notification by its ID
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  return { notifications, addNotification, removeNotification, clearAllNotifications };
};

export default useNotifcations;
