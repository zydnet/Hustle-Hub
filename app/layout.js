import { Urbanist } from 'next/font/google';
import './globals.css';
import GoogleAnalytics from '@/components/google_analytics/google_analytics';
import { UserProvider } from '@/app/_contexts/user_name';
import { NotificationProvider } from './_contexts/notification';

const urbanist = Urbanist({ subsets: ['latin'] });

export const metadata = {
   title: 'HustleHub - Job Application & Networking Tracker',
   description:
      'Track job applications, manage networking, schedule meetings, and analyze progress — all in one dashboard.',
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <head>
            {/* Favicon (use favicon.ico or your icon.png) */}
            <link rel="icon" href="/favicon_io" sizes="any" />
            <meta
               name="keywords"
               content="job application tracker, resume builder, career dashboard, HustleHub, networking, internship, career, productivity"
            />
            <meta
               property="og:title"
               content="HustleHub - Job & Networking Tracker"
            />
         </head>
         <body className={urbanist.className}>
            <GoogleAnalytics />
            <NotificationProvider>
               <UserProvider>{children}</UserProvider>
            </NotificationProvider>
         </body>
      </html>
   );
}
