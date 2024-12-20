// components/right-sidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/context/language-context';
import { getTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from './ui/sheet';
import { notifications } from '@/lib/data/notifications';
import NotificationCard from './notifications/notification-card';
import { useRightSidebar } from '@/components/context/right-sidebar-context';

export function RightSidebar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, toggleSidebar } = useRightSidebar();


  const { language } = useLanguage();


  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarContent = (
    <div className="space-y-4 h-full">
      <span className="text-lg font-semibold">{getTranslation(language, 'notifications.notificationTitle')}</span>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </div>
  );

  if (!isMounted) return null;

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={toggleSidebar}>
      <SheetContent side="right" className="w-[85%] sm:w-[350px] p-4">
        <div className="h-full bg-background">{sidebarContent}</div>
      </SheetContent>
    </Sheet>
  ) : (
    <>
      <div className={cn('relative h-svh w-[256px] transition-[width] duration-200 ease-linear', !isOpen && 'w-0')} />
      <div
        className={cn(
          'fixed right-0 top-0 z-30 h-svh w-64 bg-sidebar px-5 py-3 transition-transform duration-200 ease-linear',
          !isOpen && 'translate-x-full',
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { BetterTooltip } from '@/components/ui/tooltip';
// import { Button } from '@/components/ui/button';
// import { RouteIcon } from './icons';
// import { cn, generateUUID } from '@/lib/utils';
// import { Sheet, SheetContent } from './ui/sheet';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { createNewChat } from '@/app/(chat)/actions';

// import { notifications } from '@/lib/data/notifications';
// import NotificationCard from './notifications/notification-card';


// export function RightSidebar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const router = useRouter();

//   // Initialize states and event listeners
//   useEffect(() => {
//     setIsMounted(true);

//     const checkMobile = () => setIsMobile(window.innerWidth < 768);

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     const storedState = localStorage.getItem('right-sidebar:state');
//     setIsOpen(storedState === 'true');

//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Handle toggle for sidebar
//   const toggleSidebar = () => {
//     setIsOpen((prev) => {
//       const newState = !prev;
//       localStorage.setItem('right-sidebar:state', newState.toString());
//       return newState;
//     });
//   };

//   // Append message and navigate to chat
//   const append = async (message: { role: string; content: string }) => {
//     try {
//       const chatId = await createNewChat();

//       // Update the URL without navigation
//       window.history.replaceState({}, '', `/chat/${chatId}`);

//       // Send message
//       await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           id: chatId,
//           messages: [
//             {
//               id: generateUUID(),
//               role: message.role,
//               content: message.content,
//             },
//           ],
//           modelId: 'gpt-4o',
//         }),
//       });

//       // Close sidebar if on mobile
//       if (isMobile) setIsOpen(false);

//       // Navigate to chat page
//       router.replace(`/chat/${chatId}`);
//       router.refresh(); // Add this line to refresh the page

//     } catch (error) {
//       console.error('Error appending message:', error);
//       // Add toast notification for user feedback if needed
//     }
//   };

//   const toolboxActions = [
//     {
//       icon: '🎭',
//       title: 'Role Play',
//       label: 'Practice typical work situations together',
//       action: 'I want to practice about my job with a role play',
//     },
//     {
//       icon: '💭',
//       title: 'Guided Reflection Check-In',
//       label: 'Pause to reflect on work experiences through guided questions',
//       action: 'I would like to do a guided reflection about my work experiences',
//     },
//     {
//       icon: '🪷',
//       title: 'Calm Down Corner',
//       label: 'Take a moment to decompress when feeling overwhelmed',
//       action: 'I need help to calm down and decompress',
//     },
//     {
//       icon: '🫂',
//       title: 'Reach Out to Samhall Buddies',
//       label: 'Connect with experienced peers for advice and support',
//       action: 'I would like to connect with Samhall buddies for support',
//     },
//   ];

//   const sidebarContent = (
//     <div className="space-y-4 h-full">
//       <span className="text-lg font-semibold">Notifications</span>
//       <div className="space-y-2">
//         {notifications.map((notification) => (
//           <NotificationCard
//             key={notification.id}
//             notification={notification}
//           />
//         ))}
//       </div>
//       {/* {toolboxActions.map((action, index) => (
//         <motion.div
//           key={index}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 20 }}
//           transition={{ delay: 0.05 * index }}
//         >
//           <Button
//             variant="ghost"
//             onClick={async () => {
//               // Create new chat and get chatId
//               // const chatId = await createNewChat();

//               // Replace the URL without navigation
//               // window.history.replaceState({}, '', `/chat/${chatId}`);

//               // Optionally close the sidebar for mobile
//               // Close the sidebar regardless of device type
//               setIsOpen(false);

//               // Navigate to the chat page
//               // router.replace(`/chat/${chatId}`);

//               // Append user message
//               append({
//                 role: 'user',
//                 content: action.action,
//               });


//             }}
//             className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
//           >
//             <span className="font-medium">{action.title}</span>
//             <span className="text-muted-foreground">{action.label}</span>
//           </Button>
//         </motion.div>
//       ))} */}
//     </div>
//   );

//   if (!isMounted) return null;

//   return isMobile ? (
//     <>
//       <div className="absolute top-[px] right-2 z-50">
//         <BetterTooltip content="Toggle Notifications" align="start">
//           <Button onClick={toggleSidebar} variant="outline" className="md:p-3 md:h-fit">
//             <RouteIcon size={24} />
//           </Button>
//         </BetterTooltip>
//       </div>

//       <Sheet open={isOpen} onOpenChange={setIsOpen}>
//         <SheetContent side="right" className="w-[85%] sm:w-[350px] p-4">
//           <div className="h-full bg-background">{sidebarContent}</div>
//         </SheetContent>
//       </Sheet>
//     </>
//   ) : (
//     <>
//       <div className="mt-2 mr-2">
//         <BetterTooltip content="Toggle Notifications" align="start">
//           <Button onClick={toggleSidebar} variant="outline" className="md:p-3 md:h-fit">
//             <RouteIcon size={24} />
//           </Button>
//         </BetterTooltip>
//       </div>
//       <div className={cn('relative h-svh w-[256px] transition-[width] duration-200 ease-linear', !isOpen && 'w-0')} />
//       <div
//         className={cn(
//           'fixed right-0 top-0 z-30 h-svh w-64 bg-sidebar px-5 py-3 transition-transform duration-200 ease-linear',
//           !isOpen && 'translate-x-full',
//         )}
//       >
//         {sidebarContent}
//       </div>
//     </>
//   );
// }