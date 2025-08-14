// hooks/useRoleProtection.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useRoleProtection(requiredRole: string) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // role stored during login

    if (!token || role !== requiredRole) {
      router.push("/unauthorized"); // redirect if not allowed
    } else {
      setAuthorized(true);
    }
  }, [router, requiredRole]);

  return authorized;
}
