"use client"

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
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





const StudentChanges = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  
  const toggleVisibility = () => setIsVisible(prevState => !prevState);
  const router = useRouter();

  const handleCancel = () => {
    setNewPassword("");
    setConfirmPassword("");
    console.log("textboxes cleaned")
  };

  const handlePasswordReset = async (password: string, confirmPassword: string) => {
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
                    className="border border-gray-300 rounded px-4 py-2 text-black w-full pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-black focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                  >
                    {isVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Confirm Password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handlePasswordReset}>Save</Button>
              <Button onClick={() => handleCancel}>Cancel</Button>
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
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>


  );
};

export default StudentChanges;
