import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { X } from "lucide-react";
interface NotificationProps {
  notification: {
    id: string;
    type: "error" | "warning" | "success" | "partial-success";
    text: string | JSX.Element[];
  };
  close: (id: string) => void;
}
const CustomNotification: React.FC<NotificationProps> = ({ notification, close }) => {
  if (!notification) return null;
  return (
    <Alert variant={"default"} className="mb-4">
      <button className="absolute top-0 right-0 mt-2 mr-2 text-red-500" onClick={() => close(notification.id)}>
        <X />
      </button>
      <AlertTitle className={`font-bold ${notification.type === "warning" ? "text-yellow-500" : ""}`}>
        {notification.type === "success" ? "Success" : notification.type === "error" ? "Error" : notification.type === "partial-success" ? "Partial-success" : "Warning"}
      </AlertTitle>
      <AlertDescription>
        {Array.isArray(notification.text) ? (
          <div className="space-y-1">
            {notification.text.map((msg, i) => (
              <div key={i} className={notification.type === "success" ? "text-green-600" : "text-white"}>
                {msg}
              </div>
            ))}
          </div>
        ) : (
          notification.text
        )}
      </AlertDescription>
    </Alert>
  );
};

export default CustomNotification;
