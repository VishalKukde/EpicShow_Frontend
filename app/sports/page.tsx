"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import CategoryHero from "../components/CategoryHero";
import { sportMatches } from "./data";
import ComingSoonPage from "../components/ComingSoonPage";

const TRANSPARENT_BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));

export default function SportsPage() {
  return (

    <ComingSoonPage title="Sports booking" />
    // <PageTransition>
    //   <div className="bg-background min-h-screen select-none">
    //     <CategoryHero
    //       title="Sports"
    //       subtitle="Live cricket action with premium stadium seating"
    //     />

    //     <section className="max-w-7xl mx-auto px-5 pb-24">
    //       <div className="grid gap-8 sm:gap-8 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    //         {sportMatches.map((match, index) => (
    //           <motion.div
    //             key={match._id}
    //             initial={{ opacity: 0, y: 12 }}
    //             animate={{ opacity: 1, y: 0 }}
    //             transition={{ duration: 0.35, delay: index * 0.05 }}
    //           >
    //             <Link href={`/sports/${match._id}`} className="group block h-full">
    //               <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    //                 <div className="relative h-44 w-full overflow-hidden">
    //                   <Image
    //                     src={match.imageUrl || "/dummy.webp"}
    //                     alt={`${match.teamA} vs ${match.teamB}`}
    //                     fill
    //                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    //                     className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    //                     placeholder="blur"
    //                     blurDataURL={TRANSPARENT_BLUR_DATA_URL}
    //                   />
    //                 </div>
    //                 <div className="flex flex-1 flex-col p-5">
    //                   <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
    //                     {match.league} • {match.matchNo}
    //                   </p>
    //                   <h3 className="mt-2 text-lg font-semibold text-slate-900 line-clamp-1 min-h-[1.5rem]">
    //                     {match.teamA} vs {match.teamB}
    //                   </h3>
    //                   <div className="mt-3 space-y-2 text-sm text-slate-600 min-h-[3.5rem]">
    //                     <div className="flex items-center gap-2">
    //                       <Calendar className="h-4 w-4" />
    //                       <span>{formatDate(match.date)}</span>
    //                       <Clock className="ml-2 h-4 w-4" />
    //                       <span>{match.time}</span>
    //                     </div>
    //                     <div className="flex items-center gap-2">
    //                       <MapPin className="h-4 w-4" />
    //                       <span className="line-clamp-1">
    //                         {match.venue}, {match.city}
    //                       </span>
    //                     </div>
    //                   </div>
    //                   <div className="mt-auto pt-4 text-sm font-semibold text-slate-900">
    //                     From ₹{match.prices.standard}
    //                   </div>
    //                 </div>
    //               </div>
    //             </Link>
    //           </motion.div>
    //         ))}
    //       </div>
    //     </section>
    //   </div>
    // </PageTransition>
  );
}
