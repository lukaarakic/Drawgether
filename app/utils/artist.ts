import { useRouteLoaderData } from "@remix-run/react";
import { type loader as rootLoader } from "~/root";

export function useOptionalUser() {
  const data = useRouteLoaderData<typeof rootLoader>("root");
  return data?.artist ?? null;
}

// User must be logged in
export function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error("User not found.");
  }
  return maybeUser;
}
