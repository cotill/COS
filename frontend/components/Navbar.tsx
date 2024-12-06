import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Button } from "./ui/button";
interface NavbarProperities{
    initials: string;
    signOutButton: ()=> void;
}
export default function Navbar({initials, signOutButton}: NavbarProperities) {
  return (
    <nav className="w-full flex justify-center border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Next.js Supabase Starter</Link>
        </div>
      </div>
      <ThemeSwitcher />
          <div className="flex items-center gap-4">
            Hey, {initials}!
        <form action={signOutButton}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
    </nav>
  );
}
