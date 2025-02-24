"use client"

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userInfo } from "os";

interface StudentChangesProps {
  userId: string
}



const StudentChanges = ({ userId }: StudentChangesProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [githubUser, setGithubUser] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  
  const toggleVisibility = () => setIsVisible(prevState => !prevState);
  const router = useRouter();


  const supabase = createClient();

  useEffect(() => {
    // This will fetch data when the component mounts
    const fetchUserData = async () => {
        const { data: userInfo, error: userError } = await supabase
            .from("Students")
            .select("github")
            .eq("student_id", userId)  // match userid with the employee id
            .single(); // only 1 record returned

        if (userError) {
            console.error("error getting user data:", userError);
        } else {
            setGithubUser(userInfo.github);
        }
    };

    fetchUserData(); 
  }, [userId]);

  const handleCancel = () => {
    setNewPassword("");
    setConfirmPassword("");
    console.log("textboxes cleaned")
  };

  const handlePasswordReset = async (password: string, confirmPassword: string) => {
    // if changed_password is false, write alert that user needs to change password
    const supabase = await createClient();

    if (!password || !confirmPassword) {
      alert("Please confirm your new password");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: password });

      if (error) { 
        alert("Password update failed");
        console.error("Error updating password:", error);
      } else {
        alert("Password updated successfully");
        setNewPassword("");
        setConfirmPassword("");
        router.refresh();
        // update the changed_password field to true
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center">
      <Tabs defaultValue="password" className="w-[400px] justify-center">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
        </TabsList>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. 
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={isVisible ? "text" : "password"}
                    className="border border-gray-300 rounded px-4 py-2 text-white w-full pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-white focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                  >
                    {isVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="comfirm-password">Confirm Password</Label>
                <div className="relative">
                <Input
                    id="confirm-password"
                    type={isVisible ? "text" : "password"}
                    className="border border-gray-300 rounded px-4 py-2 text-white w-full pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-white focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                  >
                    {isVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                  </Button>
                  </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end gap-4">
                <Button className="bg-[#81C26C] text-white px-8 py-2 mb-6 rounded hover:bg-green-600" onClick={() => handlePasswordReset}>Save</Button>
                <Button className="bg-[#E75973] text-white px-8 py-2 mb-6 rounded hover:bg-red-600" onClick={() => handleCancel}>Cancel</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="github">
          <Card>
            <CardHeader>
              <CardTitle>GitHub</CardTitle>
              <CardDescription>
                When promted by your sponsor, please enter your GitHub username. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">GitHub Username</Label>
                <Input id="username" defaultValue={githubUser} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#E75973] text-white px-8 py-2 mb-6 rounded hover:bg-red-600">Save</Button>
              <Button className="bg-[#81C26C] text-white px-8 py-2 mb-6 rounded hover:bg-green-600">Cancel</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>


  );
};

export default StudentChanges;
