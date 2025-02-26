import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

interface NotificationProps {
  notification: { type: "error" | "warning" | "success" | "partial-success"; text: string | JSX.Element[] } | null;
}
const CustomNotification: React.FC<NotificationProps> = ({ notification }) => {
  if (!notification) return null;
  return (
    <Alert variant={"default"} className="msb-4">
      <AlertTitle className="font-bold">{notification.type === "success" ? "Success" : notification.type === "error" ? "Error" : notification.type ? "partial-success" : "Warning"}</AlertTitle>
      <AlertDescription>
        {notification.type === "success" && Array.isArray(notification.text) ? (
          notification.text.map((msg, i) => (
            <div key={i} className="text-white">
              {msg}
            </div>
          ))
        ) : (
          <p>{notification.text}</p>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default CustomNotification;
