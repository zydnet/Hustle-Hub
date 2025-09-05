'use client';

import { useRouter } from 'next/navigation';
import { ACCESS_TOKEN_NAME } from '@/app/_utils/api_constants';
import { useEffect } from 'react';

import NavBar from '@/components/navbar/navbar';

export default function Layout({ children }) {
   const router = useRouter();

   useEffect(() => {
      if (localStorage.getItem(ACCESS_TOKEN_NAME) == null) {
         router.push('/login');
      }
   });

   return (
      <div className="flex h-screen flex-col">
         <div className="bg-[#1c1c1c] max-sm:bg-black">
            <NavBar />
         </div>
         <div className="h-full bg-black">{children}</div>
         
      </div>
   );
}
