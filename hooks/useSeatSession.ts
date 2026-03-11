// "use client";
// import { useEffect, useState } from "react";

// export function useSeatSession() {
//   const [sessionId, setSessionId] = useState<string | null>(null);

//   useEffect(() => {
//     let id = localStorage.getItem("seatSession");

//     if (!id) {
//       if (window.crypto?.randomUUID) {
//         id = window.crypto.randomUUID();
//       } else {
//         // Fallback for older browsers or non-secure contexts
//         id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
//           const r = (Math.random() * 16) | 0;
//           const v = c === "x" ? r : (r & 0x3) | 0x8;
//           return v.toString(16);
//         });
//       }
//       localStorage.setItem("seatSession", id);
//     }

//     setSessionId(id);
//   }, []);

//   return sessionId;
// }
