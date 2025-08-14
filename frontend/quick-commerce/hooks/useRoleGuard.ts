import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useRoleGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role'); // ensure exact value: 'Admin', 'Partner', 'Customer'
    const path = router.pathname;

    // Define restricted routes for each role
    const restrictedRoutes: Record<string, string[]> = {
      Admin: ['/partners', '/partners/order', '/customer/order-status','/customer/place','/customer/products', '/customer'],
      Partner: ['/admin', '/admin/panel', '/admin/partners' ,  '/customer/order-status','/customer/place','/customer/products', '/customer'],
      Customer:['/admin', '/admin/panel', '/admin/partners', '/partners', '/partners/order'],
    };

    if (!role) {
      router.replace('/auth'); // redirect to login if no role
      return;
    }

    const restricted = restrictedRoutes[role];
    if (restricted?.some((r) => path === r || path.startsWith(r + '/'))) {
      // redirect to a safe page based on role
      const safeRoute: Record<string, string> = {
        Admin: '/admin/panel',
        Partner: '/partners',
        Customer: '/customer',
      };
      router.replace(safeRoute[role]);
    }
  }, [router]);
};
