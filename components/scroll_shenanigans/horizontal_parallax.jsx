'use client';

/**
 * Horizontal Parallax Scroll Animation Component
 *
 * This component implements a scroll-triggered expanding circle animation,
 * followed by horizontal text parallax once the circle fills the screen.
 *
 * === Key Concepts ===
 *
 * ▸ `h` — The horizontal offset from the scroll start point.
 *     → Calculated as `window.scrollY - offs.current`.
 *     → All scroll calculations are relative to this.
 *
 * ▸ `activate` — Becomes `true` when the circle container enters the viewport.
 *     → Triggers scroll listener and animation logic.
 *
 * ▸ `isFill` — Boolean flag that becomes true once the circle fills the screen.
 *     → Determines when horizontal parallax begins.
 *     → Computed when `h` surpasses the diagonal screen length (sqrt(w² + h²)).
 *
 * ▸ `winH`, `winW` — References to current window height and width.
 * ▸ `windH` — Tracked window height used to update when resized (legacy / redundancy).
 *
 * ▸ `hParallaxOffs` — Horizontal offset when `isFill` becomes `true`.
 * ▸ `hParallaxEnd` — Offset used to lock parallax after circle finishes scrolling.
 *     → `hParallaxEnd = h - hParallaxOffs`
 * ▸ `scaleOffs` — Used to scale the text when parallax is active (`= h / 1000`)
 *
 * ▸ `scrolledPast` — True when the text has started moving horizontally past the left edge.
 * ▸ `stop` — True when the animation reaches the end (bottom of circle leaves screen).
 *
 * === Behavior ===
 *
 * 1. Initial state: Circle grows as you scroll.
 * 2. Once circle fills the screen, `isFill` becomes true.
 * 3. Text begins moving horizontally using transform: translate.
 * 4. When the animation finishes, `stop` freezes the movement.
 *
 * === Notes ===
 * - Circle positioning switches between `fixed` and `sticky` depending on `stop`.
 * - Text opacity is animated based on how close it is to filling the screen.
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

export default function HParallax({ featurePos }) {
   const [h, setH] = useState(0);
   const [w, setW] = useState(0);
   const [activate, setActivate] = useState(false);
   const circleRef = useRef(null);
   const scrollDir = useRef('scrolling down');
   const offs = useRef(0);
   const winH = useRef(0);
   const winW = useRef(0);
   const prev = useRef(0);
   const [windH, setWindH] = useState(0);
   const horiRef = useRef(null);
   const [scrolledPast, setScrolledPast] = useState(false);
   const [stop, setStop] = useState(false);
   const stopRef = useRef(0);

   const scaleOffs = useRef(0);
   const hParallaxOffs = useRef(0);
   const hParallaxEnd = useRef(0);

   const [isFill, setIsFill] = useState(false);

   const featureRect = useRef(0);

   // Initialize feature rect
   useEffect(() => {
      if (featurePos && featurePos.current) {
         featureRect.current = featurePos.current.getBoundingClientRect();
      }
   }, [featurePos]);

   useEffect(() => {
      let lastScrollY = window.scrollY;
      let ticking = false;

      const updateScrollDir = () => {
         const scrollY = window.scrollY;
         if (Math.abs(scrollY - lastScrollY) < 5) {
            ticking = false;
            return;
         }
         scrollDir.current =
            scrollY > lastScrollY ? 'scrolling down' : 'scrolling up';
         lastScrollY = scrollY > 0 ? scrollY : 0;
         ticking = false;
      };

      const onScroll = () => {
         if (!ticking) {
            window.requestAnimationFrame(updateScrollDir);
            ticking = true;
         }
      };

      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
   }, []);

   // this side effect deals with window dimension change events
   useEffect(() => {
      winH.current = window.innerHeight;
      winW.current = window.innerWidth;
      const handleResize = () => {
         setTimeout(() => {
            if (featurePos && featurePos.current) {
               featureRect.current = featurePos.current.getBoundingClientRect();
               offs.current =
                  featureRect.current.bottom + window.scrollY - winH.current;
            }
            prev.current = winH.current;
            winH.current = window.innerHeight;
            winW.current = window.innerWidth;
         }, 10);
      };
      window.addEventListener('resize', handleResize);
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, [featurePos]);

   const handleScroll = useCallback(() => {
      if (window.innerHeight >= window.innerWidth) {
         setH(() => window.scrollY - offs.current);
         setW(() => window.scrollY - offs.current);
      } else {
         setH(() => window.scrollY - offs.current);
         setW(() => window.scrollY - offs.current);
      }
      // console.log(window.scrollY - offs.current, offs.current, window.scrollY);
   }, []);

   useEffect(() => {
      if (offs.current == 0) {
         offs.current = window.scrollY;
      }
      // console.log(activate, 'activate');
      if (activate) {
         //  console.log(activate,'activate')
         window.addEventListener('scroll', handleScroll);
      } else {
         if (stopRef.current == false) {
            setH(0);
            setW(0);
         }
         window.removeEventListener('scroll', handleScroll);
      }
      return () => {
         if (stopRef.current == false) {
            setH(0);
            setW(0);
         }
         window.removeEventListener('scroll', handleScroll);
      };
   }, [activate, handleScroll]);

   useEffect(() => {
      const observer = new IntersectionObserver(
         ([entry]) => {
            setActivate(entry.isIntersecting);
         },
         { root: null, rootMargin: '0px', threshold: 0 }
      );

      const node = circleRef.current; // ✅ store ref once

      if (node) {
         observer.observe(node);
         ////console.log('observing');
      }

      return () => {
         if (node) {
            observer.unobserve(node);
            ////console.log('not observing');
         }
      };
   }, []);

   useEffect(() => {
      setWindH(window.innerHeight);
      const handleResize = () => {
         setTimeout(() => {
            setWindH(window.innerHeight);
         }, 10);
      };
      window.addEventListener('resize', handleResize);
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);

   useEffect(() => {
      if (h > Math.sqrt(Math.pow(windH, 2) + Math.pow(window.innerWidth, 2))) {
         if (!isFill) {
            setIsFill(true);
         }
      } else setIsFill(false);
      //console.log('fill status', isFill, horizontalOffs.current);
   }, [h, w, windH, isFill]);

   useEffect(() => {
      if (isFill && scrolledPast) {
         scaleOffs.current = h / 1000;
         hParallaxOffs.current = h;
      }
      // console.log(h, 'here is translate offsest');
   }, [isFill, h, scrolledPast]);

   useEffect(() => {
      const onScroll = () => {
         if (horiRef.current) {
            const rect = horiRef.current.getBoundingClientRect();
            setScrolledPast(rect.left < 0); // top has gone above the screen
         }
         if (circleRef.current) {
            const rectEnd = circleRef.current.getBoundingClientRect();
            setStop(rectEnd.bottom < window.innerHeight);
            stopRef.current = rectEnd.bottom < window.innerHeight;
            hParallaxEnd.current = h - hParallaxOffs.current;
         }
      };

      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
   }, [h]);

   const getMinHeight = () => {
      if (winW.current <= 640) {
         return `${2.4 * winW.current + Math.sqrt(Math.pow(winH.current, 2) + Math.pow(winW.current, 2))}px`;
      }
      return `${1.6 * winW.current + Math.sqrt(Math.pow(winH.current, 2) + Math.pow(winW.current, 2))}px`;
   };

   return (
      <div
         style={{
            minHeight: getMinHeight(),
         }}
      >
         <div
            className={`flex justify-center`}
            ref={circleRef}
            style={{
               minHeight: getMinHeight(),
            }}
         >
            <div
               // either make it sticky when not isFill and alter the circle size increase rate on smaller screens or go with curr
               className={`${!stop ? 'fixed' : 'sticky'} ${isFill ? '' : 'rounded-full'} bg-white ${h > windH ? (stop ? 'top-[50vh]' : 'top-[50vh] -translate-y-1/2') : 'bottom-0'} flex items-center justify-center overflow-hidden text-black`}
               style={{
                  minHeight: isFill ? '100vh' : `${h}px`,
                  maxHeight: isFill ? '100vh' : `${h}px`,
                  minWidth: isFill ? '0vw' : `${w}px`,
                  maxWidth: isFill ? '' : `${w}px`,
               }}
            >
               <div
                  className="text-[20vw] max-sm:text-[30vw]"
                  style={{
                     scale: isFill ? `${scaleOffs.current}` : `${h / 1000}`,
                     transform: !isFill
                        ? '0'
                        : !stop
                          ? `translate(-${h - hParallaxOffs.current}px)`
                          : `translate(-${hParallaxEnd.current}px)`,
                  }}
               >
                  <p
                     className=""
                     style={{
                        opacity: activate
                           ? isFill
                              ? 1
                              : Math.min(
                                   (2 * h) /
                                      Math.sqrt(
                                         windH ** 2 + window.innerWidth ** 2
                                      ),
                                   1
                                )
                           : 0,
                        transition: 'opacity 0.5s ease-in-out',
                     }}
                  >
                     <span ref={horiRef} className="invisible">
                        LET&apos;S&nbsp;GO&nbsp;XXXX
                        <span className="max-sm:hidden">MA</span>
                     </span>
                     LET&apos;S&nbsp;GO&nbsp;HUSTLEHUB
                  </p>
               </div>
               <div
                  className="absolute text-[25vw]"
                  style={{
                     scale: isFill ? `${scaleOffs.current}` : `${h / 1000}`,
                     transform: !isFill
                        ? '0'
                        : !stop
                          ? `translate(-${2 * (h - hParallaxOffs.current)}px)`
                          : `translate(-${hParallaxEnd.current}px)`,
                  }}
               >
                  <div
                     className="flex text-[1vw] max-md:text-[4vw]"
                     style={{
                        opacity: activate
                           ? isFill
                              ? 1
                              : Math.min(
                                   (2 * h) /
                                      Math.sqrt(
                                         windH ** 2 + window.innerWidth ** 2
                                      ),
                                   1
                                )
                           : 0,
                        transition: 'opacity 0.5s ease-in-out',
                     }}
                  >
                     <p className="invisible text-[25vw]">
                        LET&apos;S&nbsp;GO&nbsp;XXXXMALET&apos;S&nbsp;GOXXXX
                        <span className="sm:hidden">BUUUUU</span>
                     </p>
                     <div className="flex min-w-[70vw] flex-col max-sm:min-w-[100vw]">
                        <div className="flex-1"></div>
                        <div className="flex gap-x-[0.5vw] max-sm:mx-0 max-sm:my-[-23vh] max-sm:gap-x-[1.5vw] sm:m-[8vw]">
                           <Image
                              src={'/assets/allcomp.jpeg'}
                              width={1}
                              height={1}
                              className="max-h-[10vw] min-h-[10vw] w-[8vw] object-cover max-sm:min-h-[35vw] max-sm:w-[28vw]"
                              alt="hustlehub-design"
                              unoptimized
                           />
                           <div className="flex flex-col gap-y-[0.1vw]">
                              <div className="flex-1"></div>
                              <p className="max-w-[10vw] leading-[1vw] max-sm:max-w-[30vw] max-sm:leading-[4vw]">
                                 The HustleHub
                                 <br />
                                 Mothership
                              </p>
                              {/* <div className='h-[1px] my-[0.5vw] bg max-sm:hidden-black'></div> */}
                              <p className="max-w-[10vw] leading-[.7vw] text-[#575757] max-sm:hidden max-sm:text-[2vw] max-sm:leading-[1.5vw] sm:text-[0.6vw]">
                                 <i>&quot;I&apos;m tired boss&quot;</i>
                                 <br /> HustleHub plans to expand in every
                                 dev&apos;s computer
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="flex min-w-[70vw] flex-col max-sm:min-w-[100vw]">
                        <div className="flex gap-x-[0.5vw] max-sm:mx-0 max-sm:my-[-23vh] max-sm:gap-x-[1.5vw] sm:m-[8vw]">
                           <Image
                              src={'/assets/hustlehub-design.jpg'}
                              width={1}
                              height={1}
                              className="max-h-[10vw] min-h-[10vw] w-[12vw] object-cover max-sm:min-h-[35vw] max-sm:w-[30vw]"
                              alt="hustlehub-design"
                              unoptimized
                           />
                           <div className="flex flex-col gap-y-[0.1vw]">
                              <p className="max-w-[12vw] leading-[1vw] max-sm:max-w-[30vw] max-sm:leading-[4vw]">
                                 Remnants of the 10 year old PSU that powered
                                 the mothership
                              </p>
                              <p className="max-w-[10vw] leading-[.7vw] text-[#575757] max-sm:hidden max-sm:text-[2vw] max-sm:leading-[1.5vw] sm:text-[0.6vw]">
                                 Tech-priests wept. Only slag remains.
                              </p>
                           </div>
                        </div>
                        <div className="flex-1"></div>
                     </div>
                     <div className="flex min-w-[70vw] flex-col max-sm:min-w-[100vw]">
                        <div className="flex-1"></div>
                        <div className="flex gap-x-[0.5vw] max-sm:mx-0 max-sm:my-[-23vh] max-sm:gap-x-[1.5vw] sm:m-[8vw]">
                           <Image
                              src={'/assets/selection.png'}
                              width={1}
                              height={1}
                              className="max-h-[10vw] min-h-[10vw] w-[10vw] object-cover object-[center_70%] max-sm:min-h-[35vw] max-sm:w-[35vw]"
                              alt="selection.png"
                              unoptimized
                           />
                           <div className="flex flex-col gap-y-[0.1vw]">
                              <div className="flex-1"></div>
                              <p className="max-w-[10vw] leading-[1vw] max-sm:max-w-[30vw] max-sm:leading-[4vw]">
                                 So many rejections… but tracking that 1
                                 selection
                              </p>
                              <p className="max-w-[10vw] leading-[.7vw] text-[#575757] max-sm:hidden max-sm:text-[2vw] max-sm:leading-[1.5vw] sm:text-[0.6vw]">
                                 Persistence pays off in HustleHub
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="flex min-w-[70vw] flex-col max-sm:min-w-[100vw]">
                        <div className="flex gap-x-[0.5vw] max-sm:mx-0 max-sm:my-[-23vh] max-sm:gap-x-[1.5vw] sm:m-[8vw]">
                           <Image
                              src={'/assets/ssh_bomb.jpeg'}
                              width={1}
                              height={1}
                              className="max-h-[10vw] min-h-[10vw] w-auto max-sm:min-h-[35vw]"
                              alt="ssh_bomb"
                              unoptimized
                           />
                           <div className="flex flex-col gap-y-[0.1vw]">
                              <p className="max-w-[12vw] leading-[1vw] max-sm:max-w-[30vw] max-sm:leading-[4vw]">
                                 Relating and Crying
                              </p>
                              <p className="max-w-[10vw] leading-[.7vw] text-[#575757] max-sm:hidden max-sm:text-[2vw] max-sm:leading-[1.5vw] sm:text-[0.6vw]">
                                 Turns out it&apos;s not just me.
                              </p>
                           </div>
                        </div>
                        <div className="flex-1"></div>
                     </div>
                     <div className="flex min-w-[70vw] flex-col max-sm:min-w-[100vw]">
                        <div className="flex-1"></div>
                        <div className="flex gap-x-[0.5vw] max-sm:mx-0 max-sm:my-[-23vh] max-sm:gap-x-[1.5vw] sm:m-[8vw]">
                           <Image
                              src={'/assets/hustlehub-v1.jpg'}
                              width={1}
                              height={1}
                              className="max-h-[10vw] min-h-[10vw] w-auto max-sm:min-h-[35vw]"
                              alt="hustlehub-v1"
                              unoptimized
                           />
                           <div className="flex flex-col gap-y-[0.1vw]">
                              <div className="flex-1"></div>
                              <p className="max-w-[10vw] leading-[1vw] max-sm:max-w-[30vw] max-sm:leading-[4vw]">
                                 HustleHub V0
                              </p>
                              <p className="max-w-[10vw] leading-[.7vw] text-[#575757] max-sm:hidden max-sm:text-[2vw] max-sm:leading-[1.5vw] sm:text-[0.6vw]">
                                 The dev was bullied that day
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         {/* <div className="fixed left-0 top-[20vh] z-50 bg-yellow-400 text-black">
            <b>{h}</b> h<br />
            <b>{w}</b> w<br />
            <b>{JSON.stringify(activate)}</b> activate
            <br />
            <b>{scrollDir.current}</b> scrollDir
            <br />
            <b>{offs.current}</b> offs
            <br />
            <b>{winH.current}</b> winH
            <br />
            <b>{winW.current}</b> winW
            <br />
            <b>{prev.current}</b> prev
            <br />
            <b>{windH}</b> windH
            <br />
            <b>{JSON.stringify(scrolledPast)}</b> scrolledPast
            <br />
            <b>{JSON.stringify(stop)}</b> stop
            <br />
            <b>{scaleOffs.current}</b> scaleOffs
            <br />
            <b>{hParallaxOffs.current}</b> hParallaxOffs
            <br />
            <b>{hParallaxEnd.current}</b> hParallaxEnd
            <br />
            <b>{JSON.stringify(isFill)}</b> isFill
            <br />
            <p className="bg-red-300">
               {featureRect.current.bottom} featureRect
            </p>
         </div> */}
      </div>
   );
}
