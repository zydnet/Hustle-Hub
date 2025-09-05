'use client';

import React, { useState, useContext, useEffect, useCallback } from 'react';
import { ACCESS_TOKEN_NAME } from '@/app/_utils/api_constants';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserContext } from '@/app/_contexts/user_name';
import { useNotifications } from '@/app/_contexts/notification';
import Eye from '@/components/svg/eye';
import EyeSlash from '@/components/svg/eye_slash';
import { NOTIF_TYPE } from '@/app/_enums/notification';

function LoginForm() {
   const [state, setState] = useState({
      username: '',
      password: '',
      successMessage: null,
   });

   const [passwordVisible, setPasswordVisible] = useState({ password: false });

   const router = useRouter();
   const { setUserID } = useContext(UserContext);
   const { addNotification } = useNotifications();

   // ✅ Stable function so it won’t trigger lint warnings
   const redirectToHome = useCallback(() => {
      router.push('/dashboard');
   }, [router]);

   const handleChange = (e) => {
      const { id, value } = e.target;
      setState((prevState) => ({
         ...prevState,
         [id]: value,
      }));
   };

   // ✅ Toast message from cookie
   useEffect(() => {
      const cookie = document.cookie
         .split('; ')
         .find((row) => row.startsWith('toastMessage='));

      if (cookie) {
         const message = decodeURIComponent(cookie.split('=')[1]);
         addNotification(message);
         document.cookie = 'toastMessage=; Max-Age=0; path=/'; // clear cookie
      }
   }, [addNotification]);

   // ✅ Check if already logged in
   useEffect(() => {
      const token = localStorage.getItem(ACCESS_TOKEN_NAME);
      if (token) {
         redirectToHome();
      }
   }, [redirectToHome]);

   const handleSubmitClick = (e) => {
      e.preventDefault();

      if (!state.username || !state.password) {
         addNotification('Please fill all fields.', NOTIF_TYPE.ERROR);
         return;
      }

      if (state.password.length < 8) {
         addNotification(
            'Password must be at least 8 characters.',
            NOTIF_TYPE.ERROR
         );
         return;
      }

      // Simulate success
      setState((prevState) => ({
         ...prevState,
         successMessage: 'Login successful.',
      }));

      addNotification('Login successful.', NOTIF_TYPE.SUCCESS);

      setUserID(state.username);

      // Store dummy token in localStorage
      localStorage.setItem(
         ACCESS_TOKEN_NAME,
         JSON.stringify('dummy_token_123')
      );

      redirectToHome();
   };

   return (
      <div className="flex flex-1 items-center justify-center">
         <div className="flex-1 p-[14vw] md:p-[9vw]">
            <p className="text-[40px]">Welcome</p>
            <div className="mb-[50px]">
               <p>
                  <Link href={'/registration'}>
                     <b>
                        <u>Create a free account</u>
                     </b>
                  </Link>{' '}
                  or log in to get started
               </p>
            </div>
            <form onSubmit={handleSubmitClick}>
               <div className="flex flex-col">
                  <label htmlFor="username">Username</label>
                  <input
                     type="text"
                     id="username"
                     placeholder="Enter username"
                     value={state.username}
                     onChange={handleChange}
                     required
                     className="min-h-[50px] rounded-[30px] border border-solid border-white bg-black pl-[20px] [-webkit-text-fill-color:#fff] autofill:text-white autofill:shadow-[inset_0_0_0px_1000px_rgb(0,0,0)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-violet-500"
                  />
               </div>
               <div className="mt-[20px] flex">
                  <label className="flex-1" htmlFor="password">
                     Password
                  </label>
               </div>
               <div className="flex min-h-[50px] flex-1 rounded-[30px] border border-solid border-white bg-black pl-[20px] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-violet-500">
                  <input
                     type={passwordVisible.password ? 'text' : 'password'}
                     id="password"
                     placeholder="Password"
                     value={state.password}
                     onChange={handleChange}
                     required
                     className="flex-1 bg-transparent outline-none [-webkit-text-fill-color:#fff] autofill:text-white autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,1)] autofill:[-webkit-text-fill-color:#fff!important] focus:outline-none focus:ring-0"
                  />
                  <button
                     type="button"
                     className="ml-[5px] min-w-[35px]"
                     onClick={() =>
                        setPasswordVisible((prev) => ({
                           ...prev,
                           password: !prev.password,
                        }))
                     }
                  >
                     {passwordVisible.password ? <Eye /> : <EyeSlash />}
                  </button>
               </div>
               <div className="my-2 text-right">
                  <p>
                     <u>
                        <b>
                           <Link href="/forgot_pass">Forgot password?</Link>
                        </b>
                     </u>
                  </p>
               </div>
               <button
                  type="submit"
                  disabled={state.password.length < 8}
                  className={`min-h-[56px] w-full rounded-[30px] border border-solid border-white bg-white text-black ${
                     state.password.length < 8
                        ? 'cursor-not-allowed opacity-50'
                        : ''
                  }`}
               >
                  Login
               </button>
            </form>
         </div>
      </div>
   );
}

export default LoginForm;
