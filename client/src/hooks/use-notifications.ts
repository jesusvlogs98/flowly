import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"; // Example key, ideally generated from server

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    Notification.permission
  );
  const { toast } = useToast();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("Service Worker registered:", registration);
      });
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Not Supported",
        description: "This browser does not support desktop notifications",
        variant: "destructive",
      });
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      toast({
        title: "Notifications Enabled",
        description: "You will now receive daily reminders.",
      });
      scheduleLocalReminders();
    }
  };

  // Simple local scheduling simulation since we don't have a backend push server set up yet
  const scheduleLocalReminders = () => {
    // In a real app, we'd subscribe to push manager and send subscription to backend.
    // Backend would then use web-push to send messages at specific times.
    // For MVP/Demo without backend cron jobs yet, we can simulate or just enable the capability.
    
    // Example of subscribing (would need backend support):
    // navigator.serviceWorker.ready.then(async (registration) => {
    //   const subscription = await registration.pushManager.subscribe({
    //     userVisibleOnly: true,
    //     applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    //   });
    //   // Send subscription to backend...
    // });
    
    console.log("Notifications enabled. Backend schedule would trigger pushes.");
  };

  return { permission, requestPermission };
}
