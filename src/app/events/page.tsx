import { prisma } from "@/lib/db";
import { generateSeoMetadata, getEventSchema } from "@/lib/seo";
import { MapPin, Clock, ExternalLink, Sparkles, Video } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Events & Literary Readings | Anant Yadav",
    description:
      "Upcoming and past literary festivals, poetry readings, keynotes, and speaking engagements with author Anant Yadav.",
    path: "/events",
  });
}

export default async function EventsPage() {
  const upcomingEvents = await prisma.eventItem.findMany({
    where: { published: true, isPast: false },
    orderBy: { date: "asc" },
  });

  const pastEvents = await prisma.eventItem.findMany({
    where: { published: true, isPast: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Gatherings &amp; Readings
        </div>
        <h1 className="font-serif-literary text-4xl sm:text-6xl font-bold text-stone-100 tracking-tight">
          Events &amp; Appearances
        </h1>
        <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Join Anant Yadav for poetry readings, literary festival dialogues, lectures, and interactive masterclasses.
        </p>
      </div>

      {/* Upcoming Events Section */}
      <section className="space-y-8">
        <div className="border-b border-stone-800 pb-4">
          <h2 className="font-serif-literary text-2xl sm:text-3xl font-bold text-stone-100">
            Upcoming Engagements
          </h2>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((evt) => {
              const eventJsonLd = getEventSchema({
                title: evt.title,
                description: evt.description,
                date: evt.date,
                venue: evt.venue,
                city: evt.city,
                isOnline: evt.isOnline,
                rsvpUrl: evt.rsvpUrl,
                coverImage: evt.coverImage,
              });

              return (
                <article
                  key={evt.id}
                  className="group p-8 rounded-3xl bg-stone-900/50 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
                  />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                        {evt.isOnline ? (
                          <>
                            <Video className="w-3.5 h-3.5 text-rose-400" /> Virtual Event
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5" /> In-Person Gathering
                          </>
                        )}
                      </span>
                      <span className="bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {evt.date}
                      </span>
                    </div>

                    <h3 className="font-serif-literary text-2xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                      {evt.title}
                    </h3>

                    <div className="space-y-1 text-xs text-stone-400 font-sans-ui">
                      {evt.time && (
                        <p className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-stone-400" /> {evt.time}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" /> {evt.venue}, {evt.city}
                      </p>
                    </div>

                    <p className="text-sm text-stone-300 leading-relaxed pt-2">
                      {evt.description}
                    </p>
                  </div>

                  {evt.rsvpUrl && (
                    <div className="pt-6 border-t border-stone-800/80">
                      <a
                        href={evt.rsvpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                      >
                        <span>Reserve Place / RSVP</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-stone-400 italic">
            No upcoming public events currently scheduled. Check back soon.
          </p>
        )}
      </section>

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <section className="space-y-8 border-t border-stone-800 pt-16">
          <div className="border-b border-stone-800 pb-4">
            <h2 className="font-serif-literary text-2xl font-bold text-stone-300">
              Past Archive
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-6 rounded-2xl bg-stone-900/30 border border-stone-800/80 space-y-3 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>{evt.city}</span>
                  <span>{evt.date}</span>
                </div>
                <h3 className="font-serif-literary text-lg font-bold text-stone-200">
                  {evt.title}
                </h3>
                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
