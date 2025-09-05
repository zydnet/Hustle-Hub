'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SineWaveLoader } from '@/components/ui/sine_loader';
import { ACCESS_TOKEN_NAME } from '@/app/_utils/api_constants';
import Image from 'next/image';
import { useNotifications } from '@/app/_contexts/notification';
import { NOTIF_TYPE } from '../_enums/notification';

export default function Dashboard() {
   const router = useRouter();
   const [progress, setProgress] = useState(0.7);
   const { addNotification } = useNotifications();

   useEffect(() => {
      const token = localStorage.getItem(ACCESS_TOKEN_NAME);

      if (!token) {
         addNotification('Please login first.', NOTIF_TYPE.ERROR);
         router.push('/login');
         return;
      }

      addNotification('Redirecting...');
      setTimeout(() => {
         setProgress(1);
         router.push('/dashboard/home');
      }, 1200); // small delay to show loader
   }, [addNotification, router]);

   return (
      <div className="absolute top-0 flex min-h-dvh min-w-[100vw] justify-center bg-black">
         <div className="flex h-screen flex-col items-center justify-center break-normal text-[2vw] text-white max-sm:text-3xl">
            <div className="flex items-center">
               <div className="flex flex-col">
                  <Image
                     src={'/assets/construction.png'}
                     width={1}
                     height={1}
                     alt="construction-har"
                     className="relative z-20 mb-[-4.8vw] ml-[-0.2vw] w-[8vw] -rotate-12 transition duration-300 hover:translate-x-[-1.5vw] hover:-rotate-45 max-sm:mb-[-57px] max-sm:ml-[-3px] max-sm:max-h-[65px] max-sm:w-[96px] max-sm:hover:translate-x-[-20px]"
                     unoptimized
                  />

                  <Image
                     src="/assets/logo.png"
                     width={1}
                     height={1}
                     alt="logo"
                     className="min-h-[8vw] min-w-[8vw] max-sm:min-h-[95px] max-sm:min-w-[95px]"
                     unoptimized
                  />
               </div>
               {'Redirecting...'}
            </div>
            <div className="min-w-[30vw] max-sm:min-w-[90vw]">
               <SineWaveLoader progress={progress} />
            </div>
         </div>
      </div>
   );
}
