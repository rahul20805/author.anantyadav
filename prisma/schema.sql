-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuthorProfile" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "name" TEXT NOT NULL DEFAULT 'Anant Yadav',
    "title" TEXT NOT NULL DEFAULT 'Author • Poet • Writer • Thinker',
    "taglines" TEXT NOT NULL DEFAULT 'Exploring human depth, philosophical contemplation, and modern literary expression.',
    "shortBio" TEXT NOT NULL,
    "fullBio" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "philosophy" TEXT NOT NULL,
    "education" TEXT,
    "publications" TEXT,
    "achievements" TEXT,
    "email" TEXT NOT NULL DEFAULT 'contact@anantyadav.com',
    "location" TEXT DEFAULT 'India',
    "phone" TEXT,
    "pressKitUrl" TEXT,
    "profileImage" TEXT,
    "heroImage" TEXT,
    "socialLinks" TEXT NOT NULL DEFAULT '{"twitter":"https://twitter.com/","instagram":"https://instagram.com/","linkedin":"https://linkedin.com/in/","goodreads":"https://goodreads.com/","substack":"https://substack.com/"}',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "authorNote" TEXT,
    "publisher" TEXT,
    "isbn" TEXT,
    "genre" TEXT NOT NULL DEFAULT 'Literary Fiction',
    "language" TEXT NOT NULL DEFAULT 'English',
    "pageCount" INTEGER,
    "publicationDate" TEXT,
    "coverImage" TEXT,
    "purchaseLinks" TEXT NOT NULL DEFAULT '[]',
    "rating" REAL NOT NULL DEFAULT 0.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Poem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Contemporary',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "coverImage" TEXT,
    "readingTime" INTEGER NOT NULL DEFAULT 2,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "audioUrl" TEXT,
    "publishDate" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Writing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Essay',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "coverImage" TEXT,
    "readingTime" INTEGER NOT NULL DEFAULT 5,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "canonicalUrl" TEXT,
    "publishDate" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Thought" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quote" TEXT NOT NULL,
    "context" TEXT,
    "source" TEXT DEFAULT 'Anant Yadav',
    "category" TEXT NOT NULL DEFAULT 'Philosophy',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "shareImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "publication" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "url" TEXT,
    "excerpt" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'interview',
    "coverImage" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EventItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT,
    "venue" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rsvpUrl" TEXT,
    "coverImage" TEXT,
    "isPast" BOOLEAN NOT NULL DEFAULT false,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT,
    "readerName" TEXT NOT NULL,
    "readerEmail" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isReplied" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "siteTitle" TEXT NOT NULL DEFAULT 'Anant Yadav | Author, Poet & Thinker',
    "tagline" TEXT NOT NULL DEFAULT 'Official Digital Home of Author Anant Yadav',
    "metaDescription" TEXT NOT NULL DEFAULT 'The official website of Anant Yadav: Explore books, poetry, essays, philosophical musings, events, and media.',
    "keywords" TEXT NOT NULL DEFAULT 'Anant Yadav, author, poet, writer, thinker, Indian literature, contemporary poetry, essays, books',
    "faviconUrl" TEXT,
    "ogImageUrl" TEXT,
    "authorName" TEXT NOT NULL DEFAULT 'Anant Yadav',
    "googleAnalyticsId" TEXT,
    "googleSearchConsoleToken" TEXT,
    "announcementText" TEXT,
    "announcementUrl" TEXT,
    "announcementActive" BOOLEAN NOT NULL DEFAULT false,
    "footerAbout" TEXT NOT NULL DEFAULT 'Anant Yadav is an author, poet, and thinker dedicated to exploring the nuances of the human condition, philosophy, and modern poetry.',
    "copyrightText" TEXT NOT NULL DEFAULT '© All rights reserved. Anant Yadav.',
    "navLinks" TEXT NOT NULL DEFAULT '[{"label":"Home","href":"/"},{"label":"About","href":"/about"},{"label":"Books","href":"/books"},{"label":"Poetry","href":"/poetry"},{"label":"Writings","href":"/writings"},{"label":"Thoughts","href":"/thoughts"},{"label":"Media","href":"/media"},{"label":"Events","href":"/events"},{"label":"Contact","href":"/contact"}]',
    "socialLinks" TEXT NOT NULL DEFAULT '{"twitter":"https://twitter.com/","instagram":"https://instagram.com/","linkedin":"https://linkedin.com/in/","goodreads":"https://goodreads.com/"}',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "altText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Poem_slug_key" ON "Poem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Writing_slug_key" ON "Writing"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

