import { Button } from "@/components/ui/button";

export default function CancelSaveBtn() {
  return (
    <div className="flex justify-center space-x-4">
      <Button type="submit" className="w-32 bg-[#1D1B23] text-white hover:text-black hover:bg-gray-300 hover:border border border-white">
        Cancel
      </Button>
      <Button type="submit" className="w-32 bg-white text-black hover:text-white hover:bg-gray-800 hover:border border-white">
        Save
      </Button>
    </div>
  );
}
