import { useState, useEffect, Suspense } from "react";
import { RoundSpinner } from "@/components/ui/spinner";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveCancelButtonProps {
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
}
function SaveCancelButtons({ isSaving, onCancel, onSave }: SaveCancelButtonProps) {
  return (
    <div className="flex justify-end space-x-2 mt-2">
      <Button variant="outline" onClick={onCancel} className="flex items-center">
        <X className="mr-1 h-4 w-4" /> Cancel
      </Button>
      <Button onClick={onSave} variant="outline" className="flex items-center">
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
export default SaveCancelButtons;
