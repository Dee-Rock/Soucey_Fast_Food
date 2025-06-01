"use client"

import { useAuth } from "@clerk/nextjs";
import MenuPreview from "@/components/menu-preview";
import MenuContent from "@/components/menu-content";

export default function MenuPage() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <MenuPreview />;
  }

  return <MenuContent />;
}
