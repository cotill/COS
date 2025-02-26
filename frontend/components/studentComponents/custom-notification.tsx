import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { X } from "lucide-react";
interface NotificationProps {
  notification: { type: "error" | "warning" | "success" | "partial-success"; text: string | JSX.Element[] } | null;
  close: () => void;
}
const CustomNotification: React.FC<NotificationProps> = ({ notification, close }) => {
  if (!notification) return null;
  return (
    <Alert variant={"default"} className="msb-4">
      <button className="absolute top-0 right-0 mt-2 mr-2 text-red-500" onClick={close}>
        <X />
      </button>
      <AlertTitle className={`font-bold ${notification.type === "warning" ? "text-yellow-500" : ""}`}>
        {notification.type === "success" ? "Success" : notification.type === "error" ? "Error" : notification.type === "partial-success" ? "Partial-success" : "Warning"}
      </AlertTitle>
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
