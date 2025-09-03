
import { useState, useEffect } from "react";
import { supabase, getSetting, upsertSetting } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AdminCredentials {
  username: string;
  password: string;
}

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      try {
        // 🎯 UPDATED: Check both localStorage AND Supabase session for cross-browser admin access
        const adminAuth = localStorage.getItem('adminAuthenticated');

        if (adminAuth === 'true') {
          console.log("🔐 [useAdminAuth] Admin localStorage auth found");

          // Ensure we have a Supabase session for cross-browser functionality and database operations
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
              console.log("🔐 [useAdminAuth] No Supabase session found, creating one for cross-browser access...");
              const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

              if (authError) {
                console.warn("⚠️ [useAdminAuth] Failed to create Supabase session:", authError.message);
                console.log("🔓 [useAdminAuth] Continuing with localStorage-only auth");
              } else {
                console.log("✅ [useAdminAuth] Supabase admin session created for cross-browser access");
              }
            } else {
              console.log("✅ [useAdminAuth] Existing Supabase session found");
            }
          } catch (sessionError) {
            console.warn("⚠️ [useAdminAuth] Error checking/creating Supabase session:", sessionError);
          }

          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        console.log("🔐 [useAdminAuth] No admin authentication found");
        setIsAuthenticated(false);
      } catch (error) {
        console.error("❌ [useAdminAuth] Error during auth check:", error);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Handle login with simple password check
  const handleLogin = async (username: string, password: string) => {
    try {
      console.log("Attempting login with:", username);

      // Simple password check for gallery access
      const validPasswords = ['admin123', 'pizzeria2024', 'admin'];
      const validUsernames = ['admin', 'pizzeria', 'gallery'];

      if (validPasswords.includes(password) && validUsernames.includes(username.toLowerCase())) {
        console.log("✅ [useAdminAuth] Login successful with simple auth");

        // 🎯 CRITICAL FIX: Create proper Supabase session for cross-browser admin access
        try {
          console.log("🔐 [useAdminAuth] Creating Supabase session for admin...");
          const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

          if (authError) {
            console.warn("⚠️ [useAdminAuth] Failed to create Supabase session:", authError.message);
            console.log("🔓 [useAdminAuth] Continuing with localStorage-only auth");
          } else {
            console.log("✅ [useAdminAuth] Supabase admin session created successfully");
            console.log("🔐 [useAdminAuth] Session details:", {
              user: authData.user?.id,
              session: authData.session?.access_token ? 'present' : 'missing'
            });
          }
        } catch (sessionError) {
          console.warn("⚠️ [useAdminAuth] Error creating admin session:", sessionError);
        }

        localStorage.setItem('adminAuthenticated', 'true');
        setIsAuthenticated(true);

        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel!",
        });

        return true;
      }

      // Fallback to database check
      let adminCredentials: AdminCredentials | null = null;
      const cachedCredentials = localStorage.getItem('adminCredentials');

      if (cachedCredentials) {
        try {
          adminCredentials = JSON.parse(cachedCredentials);
          console.log("Using cached admin credentials");
        } catch (e) {
          console.warn("Failed to parse cached credentials:", e);
        }
      }
      
      // If not in localStorage, get from Supabase
      if (!adminCredentials) {
        try {
          adminCredentials = await getSetting<AdminCredentials>('adminCredentials');
          console.log("Got credentials from Supabase:", adminCredentials ? "Found" : "Not found");
        } catch (e) {
          console.warn("Error getting admin credentials from Supabase:", e);
        }
      }
      
      if (!adminCredentials) {
        // Use default credentials if nothing found
        adminCredentials = { username: 'admin', password: 'persian123' };
        console.log("Using default admin credentials");
        
        // Store default credentials
        localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
        try {
          await upsertSetting('adminCredentials', adminCredentials);
          console.log("Stored default credentials in Supabase");
        } catch (e) {
          console.warn("Failed to store default credentials in Supabase:", e);
        }
      }
      
      console.log("Default credentials are:", adminCredentials);
      
      // Check if provided credentials match stored credentials
      if (username === adminCredentials.username && password === adminCredentials.password) {
        // For admin login, always use localStorage auth
        localStorage.setItem('adminAuthenticated', 'true');
        
        // Store current credentials in localStorage for future reference
        localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
        
        setIsAuthenticated(true);
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged into the admin panel."
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Update admin credentials
  const updateCredentials = async (newUsername: string, newPassword: string) => {
    try {
      if (!newUsername || !newPassword) {
        toast({
          title: "Invalid credentials",
          description: "Username and password cannot be empty",
          variant: "destructive"
        });
        return false;
      }
      
      // Update credentials in both localStorage and Supabase
      const newCredentials = { 
        username: newUsername, 
        password: newPassword 
      };
      
      console.log("Updating admin credentials to:", newUsername);
      
      // Update localStorage first
      localStorage.setItem('adminCredentials', JSON.stringify(newCredentials));
      
      // Then try to update Supabase
      try {
        await upsertSetting('adminCredentials', newCredentials);
        console.log("Updated credentials in Supabase");
      } catch (e) {
        console.warn("Failed to update credentials in Supabase:", e);
        // Continue anyway since we've updated localStorage
      }
      
      toast({
        title: "Credentials updated",
        description: "Admin username and password have been updated successfully"
      });
      
      return true;
    } catch (error) {
      console.error("Error updating credentials:", error);
      
      toast({
        title: "Update failed",
        description: "Failed to update admin credentials",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      // 🎯 UPDATED: Clear both localStorage and Supabase session for proper cross-browser logout
      console.log("🔐 Logging out admin...");

      // Clear Supabase session if it exists
      try {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.warn("⚠️ Error signing out of Supabase:", signOutError.message);
        } else {
          console.log("✅ Supabase session cleared");
        }
      } catch (sessionError) {
        console.warn("⚠️ Error clearing Supabase session:", sessionError);
      }

      // Remove admin auth state from localStorage
      localStorage.removeItem('adminAuthenticated');

      setIsAuthenticated(false);
      navigate("/admin");

      toast({
        title: "Logged out",
        description: "You've been successfully logged out from admin panel."
      });
    } catch (error) {
      console.error("Admin logout error:", error);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    handleLogin,
    handleLogout,
    updateCredentials
  };
};
