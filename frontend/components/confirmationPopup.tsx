import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Application } from "@/utils/types";
import { Button } from "./ui/button";

type ConfirmationDialogProp = {
    application_team_name: string | undefined
    onConfirm: () => void
    onCancel: () => void
}

export const ConfirmationDialog = ({application_team_name, onConfirm, onCancel}: ConfirmationDialogProp) => {
  return (
    <>
        <AlertDialogContent className="bg-black bg-opacity-70">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-center">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-200 text-base">
              Are you sure you want to delete <span className="font-bold">{application_team_name}</span> application? <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild><Button variant="outline" className="hover:bg-red-500/40 text-red-400" onClick={() => onCancel()}>Cancel</Button></AlertDialogCancel>
            <AlertDialogAction asChild>
                <Button
                variant="outline"
                className="bg-gray-200 hover:bg-white/40 text-black"
                children="Delete"
                onClick={() => onConfirm()}
            />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </>
  );
};
