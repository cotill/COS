"use client";

import { createClient } from "@/utils/supabase/client";

export default function KeycloakLogin() {
  const handleLogin = async () => {
    const supabase = createClient();


    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    // For Keycloak OIDC integration, you need to configure it as a custom provider in Supabase
    // This would typically use 'google', 'github', 'azure', etc. as built-in providers
    // For custom OIDC providers like Keycloak, you need to set it up in Supabase dashboard first
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "keycloak", // Configure this provider in your Supabase dashboard
      options: {
        scopes: "openid email profile",
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("OAuth login failed:", error.message);
      // Consider showing user-friendly error message
      alert("Login failed. Please try again or contact support.");
    }
  };

  return (
    <button 
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Sign in with Keycloak
    </button>
  );
}
