"use client"

import { Eye, EyeOff, CircleAlert, AlertCircle } from "lucide-react";
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
import ChangePassword from "../employeeComponents/user-pw-change";

interface StudentChangesProps {
  userId: string
}



const StudentChanges = ({ userId }: StudentChangesProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [githubUser, setGithubUser] = useState("");
  const [OGgithubUser, setOGgithubUser] = useState("");
  const [phone, setPhone] = useState("");
  const [OGphone, setOGphone] = useState("");
  const [changedPassword, setChangedPassword] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  

  
  const toggleVisibility = () => setIsVisible(prevState => !prevState);
  const router = useRouter();


  const supabase = createClient();

  useEffect(() => {
    // This will fetch data when the component mounts
    const fetchUserData = async () => {
        const { data: userInfo, error: userError } = await supabase
            .from("Students")
            .select("github, changed_password, Phone")
            .eq("student_id", userId)  // match userid with the employee id
            .single(); // only 1 record returned

        if (userError) {
            console.error("error getting user data:", userError);
        } else {
            setGithubUser(userInfo.github || "");
            setOGgithubUser(userInfo.github || "");
            setPhone(userInfo.Phone || "");
            setOGphone(userInfo.Phone || "");
            setChangedPassword(userInfo.changed_password ?? false)
        }
    };

    fetchUserData(); 
  }, [userId]);
  //   setGithubUser(OGgithubUser);
  //   console.log("textboxes cleaned");
  // };

  const handleGHSave = async () => {
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    const { error } = await supabase
      .from("Students")
      .update({ github: githubUser }) 
      .eq("student_id", userId);

    if (error) {
      console.error("Error updating GitHub username:", error);
      alert("Failed to update GitHub username.");
    } else {
      alert("GitHub username updated successfully!");
      setOGgithubUser(githubUser);
    }
  };

  const handlePhoneSave = async () => {
  if (!userId) {
    console.error("User ID not found.");
    return;
  }

  const { error } = await supabase
    .from("Students")
    .update({ Phone: phone })
    .eq("student_id", userId);

  if (error) {
    console.error("Error updating phone number:", error);
    alert("Failed to update phone number.");
  } else {
    alert("Phone number updated successfully!");
    setOGphone(phone);
    }
  };

  const handleCancelPhone = () => {
    setPhone(OGphone);
  };

  const handleCancel = () => {
    setNewPassword("");
    setConfirmPassword("");
    setGithubUser(OGgithubUser);
    console.log("textboxes cleaned");
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

      const { error: updateError } = await supabase
        .from('Students')
        .update({ changed_password: true })
        .eq("student_id", userId)

      if (updateError) {
        console.error("Error updating changed_password:", updateError);
      }
      if (error) { 
        alert("Password update failed");
        console.error("Error updating password:", error);
      } else {
        alert("Password updated successfully");
        setNewPassword("");
        setConfirmPassword("");
        setChangedPassword(true);
        router.refresh();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center">
      <Tabs defaultValue="password" className="w-[400px] justify-center">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. 
                {changedPassword === false && (
                  <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded-md">
                    <AlertCircle className="w-5 h-5 text-red-700" />
                    <p className="text-sm font-semibold">You must change your password.</p>
                  </div>
                )}
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
                <Button className="bg-[#E75973] text-white px-8 py-2 mb-6 rounded hover:bg-red-600" onClick={() => handleCancel()}>Cancel</Button>
                <Button className="bg-[#81C26C] text-white px-8 py-2 mb-6 rounded hover:bg-green-600" onClick={() => handlePasswordReset(newPassword, confirmPassword)}>Save</Button>
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
                <Input
                  id="username"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                />
              </div> 
            </CardContent>
            <CardFooter>
            <div className="flex justify-end gap-4">
              <Button className="bg-[#E75973] text-white px-8 py-2 mb-6 rounded hover:bg-red-600" onClick={() => handleCancel()}>Cancel</Button>
              <Button className="bg-[#81C26C] text-white px-8 py-2 mb-6 rounded hover:bg-green-600" onClick={() =>handleGHSave()}>Save</Button>
            </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="phone">
          <Card>
            <CardHeader>
              <CardTitle>Phone Number</CardTitle>
              <CardDescription>
                Update your phone number here. Please enter a valid number.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end gap-4">
                <Button className="bg-[#E75973] text-white px-8 py-2 mb-6 rounded hover:bg-red-600" onClick={() => handleCancelPhone()}>
                  Cancel
                </Button>
                <Button className="bg-[#81C26C] text-white px-8 py-2 mb-6 rounded hover:bg-green-600" onClick={() => handlePhoneSave()}>
                  Save
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

      </Tabs>
    </div>


  );
};

export default StudentChanges;
