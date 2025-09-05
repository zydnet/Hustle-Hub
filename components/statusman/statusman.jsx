'use client';

import { useState, useEffect } from 'react';
import Status from './status';
import HeightLimit from '../height_limit_scrollable/heightLimit';

export default function Statusman() {
   const [hw, setHw] = useState('50vh');
   const smRatio = 258.1;
   const lgRatio = 0.13;

   useEffect(() => {
      HeightLimit({ setHw, smRatio, lgRatio });
      return () => {
         window.removeEventListener('resize', {});
      };
   }, []);

   return (
      <div className="flex h-full flex-col">
         <div className="flex items-center justify-center max-sm:mb-3">
            <div className="flex-1">
               <span className="text-[4vw] font-light max-sm:text-6xl">
                  Job Applications Board
               </span>
            </div>
         </div>
         <div className="flex flex-1 pt-[0.5px]" id="victim">
            <Status hw={hw} />
         </div>
      </div>
   );
}
