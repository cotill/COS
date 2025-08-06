import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import OauthSignin from "@/components/OauthSignin";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="pt-[13%] w-full">
      <div className="w-full flex justify-around p-12">
        <div className="flex flex-col gap-20 items-center">
          <img
            src="/ttg-logo.png"
            alt="Tartigrade Limited"
            className="w-[70%]"
          />
          <div className="space-y-0 flex flex-col items-center">
            <h1 className="text-5xl font-extralight text-white">Capstone</h1>
            <h2 className="text-5xl font-extralight text-white">Onboarding</h2>
          </div>
        </div>

        <div className="w-[400px] flex items-center justify-center">
          {/* <form className="flex flex-col space-y-4">
            <div className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-white text-sm">
                  Email
                </Label>
                <Input
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="bg-[#1a1f36] border-0 h-12 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-white text-sm">
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Your password"
                  required
                  className="bg-[#1a1f36] border-0 h-12 text-white placeholder:text-white/50"
                />
              </div>
              <div className="flex justify-between text-sm">
                <Link
                  className="text-[#8e95a8] hover:text-white transition-colors"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
                <Link
                  className="text-[#8e95a8] hover:text-white transition-colors"
                  href="/sign-up"
                >
                  First time user?
                </Link>
              </div>
            </div>

            <SubmitButton
              pendingText="Signing In..."
              formAction={signInAction}
              className="w-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-medium h-11 rounded"
            >
              Login
            </SubmitButton>

            

            <FormMessage message={searchParams} />

          </form> */}
          <OauthSignin />
        </div>
      </div>
    </div>
  );
}
