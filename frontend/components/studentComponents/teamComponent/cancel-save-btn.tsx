import { Button } from "@/components/ui/button";
import { RoundSpinner } from "@/components/ui/spinner";
import { Check } from "lucide-react";
import { useState } from "react";

interface CancelSaveBtnProp {
  onSave: () => void;
  onCancel: () => void;
  onToggleBtnDisplay?: () => void;
}

const timeoutLength = 1500;
export default function CancelSaveBtn({ onSave, onCancel, onToggleBtnDisplay }: CancelSaveBtnProp) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      onSave();
      setIsSaving(false);
      if (onToggleBtnDisplay) {
        onToggleBtnDisplay(); // toggle what button to be displayed after the save cancel buttons are closed
      }
    }, timeoutLength);
  };
  const handleCancel = () => {
    onCancel();
    if (onToggleBtnDisplay) {
      onToggleBtnDisplay(); // toggle what button to be displayed after the save cancel buttons are closed
    }
  };
  return (
    <div className="flex justify-center space-x-4">
      <Button type="submit" className="w-32 bg-[#1D1B23] text-white hover:text-black hover:bg-gray-300 hover:border border border-white" onClick={handleCancel}>
        Cancel
      </Button>
      <Button type="submit" className="w-32 bg-white text-black hover:text-white hover:bg-gray-800 hover:border border-white" onClick={handleSave}>
        {isSaving ? (
          <>
            <RoundSpinner size="xs" color="white" />
            <span className="ml-1">Saving...</span>
          </>
        ) : (
          <>
            <Check className="mr-1 h-4 w-4" /> Save
          </>
        )}
      </Button>
    </div>
  );
}
