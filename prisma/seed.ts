import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@anantyadav.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "AnantAuthor@2026";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: "Anant Yadav" },
    create: {
      email: adminEmail,
      name: "Anant Yadav",
      passwordHash,
      role: "superadmin",
    },
  });

  // 2. Author Profile
  await prisma.authorProfile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Anant Yadav",
      title: "Author • Poet • Writer • Thinker",
      taglines: "Exploring human depth, philosophical contemplation, and modern literary expression.",
      shortBio: "Anant Yadav is an Indian author, poet, and contemplative essayist whose writings investigate the intersections of memory, language, silence, and human consciousness.",
      fullBio: `Anant Yadav is an Indian author, poet, and thinker known for his introspective literary style, philosophical depth, and poetic precision.

His work spans poetry collections, philosophical essays, and meditative fiction exploring the architecture of human solitude, the weight of forgotten memories, and the quiet dignity of existence in a hyper-connected world.

Rooted in rich literary traditions while engaging directly with modern existential questions, Anant's writing invites readers to pause, reflect, and rediscover the profound beauty embedded in silence and deliberate contemplation. When not writing, he conducts literary discussions, explores philosophy, and mentors emerging writers.`,
      statement: "To write is not merely to capture what exists, but to listen attentively to what silence has left unsaid.",
      philosophy: "Literature must be an anchor of stillness in an age of noise. I believe poetry is the shortest distance between two souls, and honest prose is a mirror held not to the world's vanity, but to its tender vulnerabilities.",
      education: "Master of Arts in English Literature & Philosophy",
      publications: "Featured in numerous literary journals, international anthologies, and independent literary reviews.",
      achievements: "Honored speaker at regional literary festivals and cultural symposiums.",
      email: "contact@anantyadav.com",
      location: "India",
      phone: "+91 98765 43210",
      pressKitUrl: "/press-kit.pdf",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      heroImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
      socialLinks: JSON.stringify({
        twitter: "https://twitter.com/",
        instagram: "https://instagram.com/",
        linkedin: "https://linkedin.com/in/",
        goodreads: "https://goodreads.com/",
        substack: "https://substack.com/",
        amazon: "https://amazon.com/author/",
      }),
      isPublished: true,
    },
  });

  // 3. Site Settings
  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteTitle: "Anant Yadav | Author, Poet & Thinker",
      tagline: "Official Digital Home of Author Anant Yadav",
      metaDescription: "The official website of Anant Yadav: Explore books, poetry, essays, philosophical musings, events, and media.",
      keywords: "Anant Yadav, author, poet, writer, thinker, Indian literature, contemporary poetry, essays, books, philosophy",
      authorName: "Anant Yadav",
      announcementActive: false,
      announcementText: "Welcome to the official literary website of Anant Yadav.",
      announcementUrl: "/books",
      footerAbout: "Anant Yadav is an author, poet, and thinker dedicated to exploring the nuances of the human condition, philosophy, and modern poetry.",
      copyrightText: "© 2026 Anant Yadav. All rights reserved.",
      navLinks: JSON.stringify([
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Books", href: "/books" },
        { label: "Poetry", href: "/poetry" },
        { label: "Writings", href: "/writings" },
        { label: "Thoughts", href: "/thoughts" },
        { label: "Media", href: "/media" },
        { label: "Events", href: "/events" },
        { label: "Contact", href: "/contact" },
      ]),
      socialLinks: JSON.stringify({
        twitter: "https://twitter.com/",
        instagram: "https://instagram.com/",
        linkedin: "https://linkedin.com/in/",
        goodreads: "https://goodreads.com/",
      }),
    },
  });

  // 4. Books
  const books = [
    {
      title: "Echoes of the Unspoken",
      slug: "echoes-of-the-unspoken",
      subtitle: "A Collection of Poems on Silence, Memory, and Longing",
      description: "A profound poetic exploration into the unspoken dialogues between the self and the universe.",
      longDescription: `Echoes of the Unspoken is Anant Yadav's landmark poetry collection, drawing together seventy poems composed over four transformative years.

Divided into three distinct movements—*The Whispering Stone*, *Cartographies of Absence*, and *The Morning After Dusk*—the book traverses themes of quiet solitude, the frailty of remembered love, and the quiet resilience of the human spirit.

Each verse is sculpted with crystalline minimalism, leaving generous white space on the page that mirrors the pregnant pauses between spoken words.`,
      authorNote: "This collection was written largely in the late hours of the night, when the clamor of the world recedes and we are left with only our honest reflections.",
      publisher: "Literary Horizon Press",
      isbn: "978-81-987654-0-1",
      genre: "Poetry / Philosophy",
      language: "English",
      pageCount: 168,
      publicationDate: "2025-10-15",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      purchaseLinks: JSON.stringify([
        { label: "Amazon Paperback", url: "https://amazon.com", isPrimary: true },
        { label: "Kindle Edition", url: "https://amazon.com/kindle", isPrimary: false },
        { label: "Barnes & Noble", url: "https://barnesandnoble.com", isPrimary: false },
        { label: "Goodreads", url: "https://goodreads.com", isPrimary: false },
      ]),
      rating: 4.8,
      reviewCount: 42,
      featured: true,
      published: true,
      tags: JSON.stringify(["poetry", "solitude", "philosophy", "contemporary"]),
      seoTitle: "Echoes of the Unspoken by Anant Yadav | Official Book Page",
      seoDescription: "Discover 'Echoes of the Unspoken', the acclaimed poetry collection by Anant Yadav exploring silence, memory, and existential longing.",
    },
    {
      title: "The Architecture of Silence",
      slug: "the-architecture-of-silence",
      subtitle: "Essays on Solitude, Thought, and Modern Living",
      description: "A collection of meditative essays investigating how stillness and contemplative thought survive in the modern digital age.",
      longDescription: `In an era defined by perpetual noise and relentless acceleration, what happens to the human capacity for deep contemplation?

In The Architecture of Silence, Anant Yadav crafts twelve interconnected essays examining how ancient philosophies of quietude can illuminate our contemporary anxieties. Through personal memoirs, literary critiques, and philosophical inquiry, Yadav argues that solitude is not isolation, but the fertile ground from which all genuine creation and understanding spring.`,
      authorNote: "An invitation to build small sanctuaries of stillness in your daily life.",
      publisher: "Solitude & Pen Editions",
      isbn: "978-81-987654-1-8",
      genre: "Non-Fiction / Philosophy / Essays",
      language: "English",
      pageCount: 224,
      publicationDate: "2026-03-20",
      coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
      purchaseLinks: JSON.stringify([
        { label: "Amazon Pre-Order", url: "https://amazon.com", isPrimary: true },
        { label: "Hardcover Edition", url: "https://bookshop.org", isPrimary: false },
      ]),
      rating: 4.9,
      reviewCount: 18,
      featured: true,
      published: true,
      tags: JSON.stringify(["essays", "philosophy", "solitude", "mindfulness"]),
      seoTitle: "The Architecture of Silence - Anant Yadav | New Book",
      seoDescription: "Read about 'The Architecture of Silence', an insightful collection of essays on solitude and modern consciousness by Anant Yadav.",
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { slug: book.slug },
      update: book,
      create: book,
    });
  }

  // 5. Poetry
  const poems = [
    {
      title: "The Geometry of Memory",
      slug: "the-geometry-of-memory",
      subtitle: "On angles of forgotten light",
      content: `Memory does not travel in straight lines;
it bends around the corners of rooms
where we once spoke our truest names.

A teacup left upon the sill,
the slant of four o'clock sunlight
through linen curtains—
these are the coordinates
of everything we thought was lost.

We measure distance not in miles,
but in the seconds before an echo
returns with the sound
of our own breathing.`,
      excerpt: "Memory does not travel in straight lines; it bends around the corners of rooms where we once spoke our truest names.",
      category: "Philosophical",
      tags: JSON.stringify(["memory", "solitude", "time", "reflection"]),
      coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
      readingTime: 2,
      featured: true,
      published: true,
      publishDate: "2026-01-14",
      seoTitle: "The Geometry of Memory | Poem by Anant Yadav",
      seoDescription: "Read 'The Geometry of Memory', a lyrical poem by Anant Yadav exploring the contours of time, light, and remembrance.",
    },
    {
      title: "Whispers Before Dawn",
      slug: "whispers-before-dawn",
      subtitle: "The threshold between sleep and morning",
      content: `In the blue hour before the sparrows wake,
the city holds its breath.

Every river that runs through us
flows backwards into quietness.
The doubts that weighed like iron
at midnight
dissolve into mist.

Here, in this brief interval,
you are neither what you have done
nor what you fear to become.

You are simply the listener
at the edge of day.`,
      excerpt: "In the blue hour before the sparrows wake, the city holds its breath.",
      category: "Contemplative",
      tags: JSON.stringify(["dawn", "stillness", "morning", "peace"]),
      coverImage: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80",
      readingTime: 2,
      featured: true,
      published: true,
      publishDate: "2026-02-01",
      seoTitle: "Whispers Before Dawn - Poem by Anant Yadav",
      seoDescription: "A meditative poem by Anant Yadav capturing the profound serenity of the quiet pre-dawn world.",
    },
    {
      title: "Shadows on Water",
      slug: "shadows-on-water",
      subtitle: "The impermanence of touch",
      content: `Do not ask the river
to preserve your silhouette.

It takes what you offer—
the reflection of your palms,
the silver ripple of your gaze—
and carries it downstream
to the waiting sea.

What you love
is never owned;
it is only borrowed
from the current.`,
      excerpt: "Do not ask the river to preserve your silhouette. It takes what you offer and carries it downstream.",
      category: "Nature & Self",
      tags: JSON.stringify(["water", "impermanence", "nature", "letting-go"]),
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      readingTime: 1,
      featured: false,
      published: true,
      publishDate: "2026-02-18",
      seoTitle: "Shadows on Water | Poem by Anant Yadav",
      seoDescription: "A short philosophical poem on impermanence, detachment, and the flowing nature of existence.",
    },
    {
      title: "The Cartography of Grief",
      slug: "the-cartography-of-grief",
      subtitle: "Mapping the unmapped terrains",
      content: `No atlas contains the valley
where a sentence broke in half.

We wander through familiar streets
carrying borders inside our ribs,
unmarked frontiers
where tenderness once lived.

Yet even in the barren soil
of an unexpected winter,
the root remembers
how to seek the spring.`,
      excerpt: "No atlas contains the valley where a sentence broke in half. We wander through familiar streets carrying borders inside our ribs.",
      category: "Emotional",
      tags: JSON.stringify(["grief", "healing", "hope", "resilience"]),
      coverImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80",
      readingTime: 2,
      featured: true,
      published: true,
      publishDate: "2026-03-02",
      seoTitle: "The Cartography of Grief - Poetry by Anant Yadav",
      seoDescription: "An evocative poem mapping sorrow, emotional geography, and the quiet return of hope.",
    },
  ];

  for (const poem of poems) {
    await prisma.poem.upsert({
      where: { slug: poem.slug },
      update: poem,
      create: poem,
    });
  }

  // 6. Writings / Essays
  const writings = [
    {
      title: "On the Necessity of Solitude in Modern Thought",
      slug: "necessity-of-solitude",
      subtitle: "Why uninterrupted contemplation is the lifeblood of human creativity",
      content: `## The Disappearance of Quiet Spaces

In contemporary society, solitude is frequently conflated with loneliness. We have engineered our environments to be relentlessly communicative—every empty pocket of time is instantly colonized by notifications, feeds, and the ambient anxiety of digital proximity.

Yet, throughout intellectual history, the greatest breakthroughs in literature, art, and philosophy were forged in deliberate isolation. Solitude is not the absence of others; it is the presence of oneself.

> "Solitude is where one discovers that one is not alone, but populated by centuries of thought, memory, and longing."

### The Difference Between Isolation and Solitude

* **Isolation** is an involuntary deprivation of connection. It contracts the spirit and breeds alienation.
* **Solitude** is an intentional sanctuary. It expands consciousness, allowing ideas to ferment without the distorting pressure of external consensus.

When we deny ourselves solitude, our thinking becomes derivative. We begin to echo the rhythms of the crowd rather than discovering the cadence of our own convictions.

### Reclaiming the Unoccupied Mind

To reclaim solitude is an act of cultural rebellion. It requires setting boundaries with the digital world, embracing the fruitful discomfort of boredom, and allowing our thoughts to wander into uncharted territories.

In doing so, we rediscover the quiet dignity of reading deeply, thinking patiently, and writing with unhurried authenticity.`,
      excerpt: "Solitude is not the absence of others; it is the presence of oneself. In an age of perpetual connectivity, reclaiming stillness is an act of creative survival.",
      category: "Philosophy",
      tags: JSON.stringify(["solitude", "philosophy", "modernity", "creativity"]),
      coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      readingTime: 5,
      featured: true,
      published: true,
      publishDate: "2026-02-10",
      seoTitle: "On the Necessity of Solitude in Modern Thought | Anant Yadav",
      seoDescription: "An essay by Anant Yadav on why intentional solitude is indispensable for creativity, deep thinking, and emotional balance.",
    },
    {
      title: "The Weight of the Written Word",
      slug: "weight-of-the-written-word",
      subtitle: "Language as an ethical responsibility and artistic devotion",
      content: `## The Ephemeral vs. The Enduring

Every day, billions of words are dispatched into the digital ether—fleeting, transactional, and forgotten as quickly as they are generated. In such an ecosystem, what is the role of the author?

The author's task is not to add to the volume of noise, but to elevate words back to their sacred weight. A single phrase, if chiseled with honesty and care, can outlive empires and outlast centuries.

### Precision as Compassion

Precision in language is not merely an aesthetic preference; it is an act of ethical responsibility. When we choose our words with care, we honor both the complexity of human experience and the attention of the reader.

When we write carelessly, we blur reality. When we write with rigor, we bring the world into sharp, luminous focus.`,
      excerpt: "The author's task is not to add to the volume of noise, but to elevate words back to their sacred weight.",
      category: "Literary Craft",
      tags: JSON.stringify(["writing", "literature", "language", "craft"]),
      coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
      readingTime: 4,
      featured: true,
      published: true,
      publishDate: "2026-02-24",
      seoTitle: "The Weight of the Written Word | Essay by Anant Yadav",
      seoDescription: "An essay exploring the ethical and aesthetic weight of language in an era of rapid digital communication.",
    },
  ];

  for (const writing of writings) {
    await prisma.writing.upsert({
      where: { slug: writing.slug },
      update: writing,
      create: writing,
    });
  }

  // 7. Thoughts / Quotes
  const thoughts = [
    {
      quote: "Silence is not the absence of sound, but the presence of an attention so deep that the world ceases its demand to be answered.",
      context: "Notes on Contemplative Living",
      category: "Silence",
      featured: true,
      published: true,
    },
    {
      quote: "We do not read to escape reality, but to acquire the vocabulary required to withstand it.",
      context: "Address at Delhi Literary Forum",
      category: "Literature",
      featured: true,
      published: true,
    },
    {
      quote: "A true poem does not give you answers; it opens a door to the questions you had forgotten how to ask.",
      context: "Prefatory note in Echoes of the Unspoken",
      category: "Poetry",
      featured: true,
      published: true,
    },
    {
      quote: "Memory is an architect that rebuilds yesterday out of the shadows we were too hurried to notice.",
      context: "The Architecture of Silence",
      category: "Memory",
      featured: false,
      published: true,
    },
    {
      quote: "Patience is not passive waiting; it is the quiet confidence that meaning matures only in unhurried soil.",
      context: "Reflections on Craft",
      category: "Patience",
      featured: false,
      published: true,
    },
  ];

  for (const thought of thoughts) {
    await prisma.thought.create({ data: thought });
  }

  // 8. Media Items
  const mediaItems = [
    {
      title: "Interview: The Poetry of Stillness in an Accelerated World",
      publication: "Literary Review & Chronicle",
      date: "2026-01-20",
      url: "https://example.com/interview",
      excerpt: "An in-depth conversation with Anant Yadav on crafting verse, the philosophy of solitude, and his creative rituals.",
      mediaType: "interview",
      coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      featured: true,
      published: true,
    },
    {
      title: "Podcast Feature: Finding Meaning Beyond the Noise",
      publication: "The Modern Thinker Podcast",
      date: "2026-02-14",
      url: "https://example.com/podcast",
      excerpt: "A wide-ranging discussion touching on literature, modern philosophy, and rediscovering wonder in daily life.",
      mediaType: "podcast",
      coverImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
      featured: true,
      published: true,
    },
  ];

  for (const item of mediaItems) {
    await prisma.mediaItem.create({ data: item });
  }

  // 9. Events
  const events = [
    {
      title: "Keynote & Poetry Reading: The Voice in the Void",
      date: "2026-10-18",
      time: "6:30 PM - 8:30 PM IST",
      venue: "India Habitat Centre, Stein Auditorium",
      city: "New Delhi, India",
      description: "An evening of live poetry recitations, literary discussions, and an audience Q&A with author Anant Yadav.",
      rsvpUrl: "https://example.com/events/delhi",
      coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      isPast: false,
      isOnline: false,
      featured: true,
      published: true,
    },
    {
      title: "Virtual Masterclass: The Art of Stanza and Silence",
      date: "2026-11-05",
      time: "5:00 PM - 7:00 PM IST",
      venue: "Online Webinar",
      city: "Global (Online)",
      description: "An interactive masterclass for writers and poets on meter, rhythm, and crafting resonant poetic imagery.",
      rsvpUrl: "https://example.com/events/masterclass",
      coverImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
      isPast: false,
      isOnline: true,
      featured: false,
      published: true,
    },
    {
      title: "Panel Discussion: Contemporary Poetics & Indian Voices",
      date: "2025-11-20",
      time: "3:00 PM IST",
      venue: "Literature Pavilion",
      city: "Jaipur, India",
      description: "A panel discussion exploring contemporary poetic styles, heritage, and translating inner life to paper.",
      rsvpUrl: "https://example.com/events/past-panel",
      coverImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
      isPast: true,
      isOnline: false,
      featured: false,
      published: true,
    },
  ];

  for (const event of events) {
    await prisma.eventItem.create({ data: event });
  }

  // 10. Sample Reader Reviews
  const firstBook = await prisma.book.findFirst({ where: { slug: "echoes-of-the-unspoken" } });
  if (firstBook) {
    await prisma.review.createMany({
      data: [
        {
          bookId: firstBook.id,
          readerName: "Aarav Sharma",
          readerEmail: "aarav@example.com",
          rating: 5,
          comment: "An extraordinary collection. Yadav's ability to express deep philosophical truths with such minimal, lyrical language is breathtaking.",
          isApproved: true,
          isFeatured: true,
        },
        {
          bookId: firstBook.id,
          readerName: "Elena Vance",
          readerEmail: "elena@example.com",
          rating: 5,
          comment: "Echoes of the Unspoken stayed with me for weeks. It is rare to encounter poetry that feels both ancient and urgently modern.",
          isApproved: true,
          isFeatured: true,
        },
      ],
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
