"use client";

import React, { useEffect, useState } from "react";
import UserProfileDashboard from "./UserProfileDashboard";
import { useRouter } from "next/navigation";

const ProfileWrapper = () => {
  const router = useRouter();

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchLoggedInUser = async () => {
      const url = process.env.NEXT_PUBLIC_LOGGEDIN_USER;

      if (!url) {
        console.error("NEXT_PUBLIC_LOGGEDIN_USER is not defined.");

        if (mounted) {
          setLoading(false);
        }

        return;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!mounted) return;

        if (!response.ok) {
          setLoggedInUser(null);
          return;
        }

        // API returns the user object directly.
        setLoggedInUser(result ?? null);
      } catch (error) {
        console.error("Failed to fetch logged-in user:", error);

        if (mounted) {
          setLoggedInUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLoggedInUser();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Redirect AFTER rendering has finished.
   *
   * This prevents:
   * "Cannot update a component (LinkComponent) while rendering
   * a different component (ProfileWrapper)"
   */
  useEffect(() => {
    if (!loading && !loggedInUser) {
      router.replace("/sign-in");
    }
  }, [loading, loggedInUser, router]);

  if (loading) {
    return null;
  }

  if (!loggedInUser) {
    return null;
  }

  return <UserProfileDashboard userData={loggedInUser} />;
};

export default ProfileWrapper;
