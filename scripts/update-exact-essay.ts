import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/db";

// Load .env
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const match =
        line.match(/^\s*([\w.-]+)\s*=\s*"(.*)"\s*$/) ||
        line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const [, key, value] = match;
        if (!process.env[key]) {
          process.env[key] = value.trim();
        }
      }
    }
  }
} catch (e) {}

async function updateExactEssay() {
  const essayContent = `Calling a woman Devi costs nothing. Giving her the rights a man already has costs a great deal more, and the distance between the two is the whole argument.

There is a line that comes up every time this subject is raised: in our culture, women are worshipped. Devi, Shakti, Maa. Nobody hands out those names by accident, the argument goes, so where exactly is the problem?

I have one question in return. If a woman is really treated as a goddess, why does she still have to ask for the rights any ordinary human being gets without asking?

Watch when the discomfort begins. Praise is welcome at every dinner table. But the moment a woman says she wants a say in her education, her marriage, her career, her property or what happens to her own body, the mood changes and she is "just a woman" again. The titles were fine only as long as they stayed titles.

## The pedestal is not a compliment

Nobody likes being told they belong at the bottom, and anyone told so can see the arrangement clearly enough to argue with it. A pedestal works differently. Tell a woman she is sacred, pure, the honour of the family, and she may start to feel proud of the position. Then it becomes awkward to complain about the terms attached to it. Sacred people are expected to sacrifice. Pure people are expected to be careful. The family's honour is expected to behave.

This is not only my suspicion. In 1996 the psychologists Peter Glick and Susan Fiske gave it a name, benevolent sexism: attitudes that sound warm and admiring, that describe women as pure and deserving of protection, yet still assume women are weaker and belong in a narrower place. The research that followed is uncomfortable reading. A 2000 study spanning 19 nations found that this kind of praise and open hostility tended to rise together from one country to the next, and that the nations scoring highest on both had weaker records on gender equality. In experiments by John Jost and Aaron Kay, people exposed to flattering gender stereotypes came away more convinced that the existing social arrangement was fair. Julia Becker and Stephen Wright later found that women who read benevolent sexist statements were less willing to join collective action for change, while hostile sexism pushed them the other way.

Read that last finding again. Kind words can be better than harsh ones at keeping women from organising against the arrangement.

## A simple test

Try this. If these women are goddesses, would you control what a goddess wears? Decide whom she marries? Stop her from studying, or tell her where she may go? Doubt her character because she spoke to another man? Beat her? Assault her? Kill her to protect the family's name? Silence her when she speaks against injustice?

Nobody would say yes to any of that about the idol in a temple. And yet every item on that list is something real women in this country report, and something Indian courts have had to rule on. If the answer is no for the goddess, I would like to know why it is acceptable for the woman.

## What the record says

Sentiment is easy to wave away, so here is the record:

* **Crimes against women registered in India, 2022**: 4,45,256 cases, up 4% on 2021. Cruelty by husband or relatives was the largest category at 31.4% (NCRB).
* **Ever-married women (18–49) reporting spousal violence**: About 29% in NFHS-5 (2019–21); 22.3% in NFHS-6 (2026) (IIPS and MoHFW).
* **Child sex ratio (0–6 years), 2011**: 918 girls per 1,000 boys (Census of India).
* **Legal rights women hold relative to men**: 64% worldwide; 60% in India (World Bank).
* **Women worldwide who have faced physical or sexual violence**: About 1 in 3 (WHO).

Two cautions. Registered cases show only what reaches a police station, so the real figures are almost certainly higher. On the other hand, the fall in reported spousal violence between the last two survey rounds is welcome news, and it deserves to be said plainly. Even so, more than one in five ever-married women reporting violence from a spouse is not the picture of a society that reveres them.

A country that fills its temples every Navratri also recorded 918 girls for every 1,000 boys under six in the 2011 Census. That number does not prove one thing causes the other. It does show that the goddess and the girl child can live in the same country without the first doing anything for the second.

## The texts argue with themselves

The line most often quoted to prove reverence is Manusmriti 3.56, roughly: where women are honoured, the gods are pleased. Read further and the same book says a girl stays under her father's guard in childhood, her husband's in youth and her sons' in old age, and that a woman does not deserve independence (5.148 and 9.3). Reverence and control sit in one text, and they are defended by the same people, often in one sentence. That is the contradiction I am pointing at. "Women are Shakti" on one side, "women must stay under a man's control" on the other. Both cannot be the working principle.

> "Ek taraf Devi bolte ho. Dusri taraf suppress karte ho."
> On one side you call her Devi. On the other you suppress her.

I am not claiming this is all Hindu thought contains. It is not. The tradition is vast and argued over, and some of the sharpest criticism of this arrangement has come from inside it. Tarabai Shinde wrote Stri Purush Tulana in 1882 to attack the double standards imposed on women. B. R. Ambedkar resigned as Law Minister in 1951 after his Hindu Code Bill stalled in Parliament; its main provisions were later passed as separate Acts in 1955 and 1956.

Nor is this one religion's habit. Almost every religious society has its own vocabulary for honouring women, and the useful question in each is how much of that honour is symbol and how much is substance. Mary Wollstonecraft was already making the point in 1792, arguing that admiration for women's charm and delicacy was keeping them from being educated as reasoning adults. Simone de Beauvoir, in 1949, described the idealised "eternal feminine" as a myth that helps keep women in place.

## Questioning is not hatred

When someone raises this contradiction, the reply is rarely an argument. It is a label: anti-religion. But if a text, or one reading of it, supports inequality, why can't a woman simply say, "I don't accept this"? Questioning a tradition is not an insult to it. Rejecting one interpretation is not hatred for everyone who follows the faith. Religion should never be the excuse for violence or oppression.

And violence is wider than a raised hand. It can be a marriage forced on someone, an education denied, control over her body, sexual violence, domestic abuse, an honour killing. It can be psychological too: the daily message that her whole existence is meant to serve her father, husband, family or society. Indian law already recognises this broader picture. The Protection of Women from Domestic Violence Act, 2005 counts physical, sexual, verbal, emotional and economic abuse as domestic violence.

Look also at how the courts reason. In Shakti Vahini v. Union of India (2018), the Supreme Court issued directions against honour killings and against interference by khap panchayats in the marriages of consenting adults. In Shafin Jahan v. Asokan K.M. (2018), it held that an adult's choice of partner and faith is part of personal liberty, which neither family, community nor state may override. In Vineeta Sharma v. Rakesh Sharma (2020), it ruled that daughters have equal rights by birth in Hindu joint family property, whether or not the father was alive when the law changed in 2005. None of these judgments says women deserve rights because they are divine. They rest on the equality and liberty promised by Articles 14, 15 and 21 of the Constitution, which is to say, on being a person.

## Human, not holy

A goddess is expected to be perfect. A woman should be allowed to be imperfect. A goddess is expected to sacrifice; a woman should decide for herself whether she wants to sacrifice anything at all. A goddess is worshipped. A woman should be heard. A goddess stands on a pedestal, and a woman should be able to stand beside you.

I do not want a society that worships women and does not listen to them. I do not want one that puts her on a pedestal and then stops her from walking freely, that calls her Shakti and denies her real power, that calls her Maa until her own identity disappears behind the word. And I do not want one where a woman has to turn extraordinary, divine or sacred before she is allowed basic respect. An ordinary woman should be able to be an ordinary woman and hold the same dignity, freedom and rights as a man.

Let me be clear about religion, too. I am not saying women must leave it. A woman should be able to believe in God, question God, follow a faith, question its traditions, reinterpret them, or leave altogether, and in every case keep exactly the same human rights. Her freedom should never depend on her religion. Her rights come from the fact that she is human, not from a title that society decides to hand her.

So do not give women symbolic divinity in place of actual equality. When she says, "Treat me like a human being and give me my rights," do not answer, "But you are Devi."

> "Don't make women goddesses. Don't make them inferior either. Let them be human, with every right that comes with it."`;

  const pdfPath = path.join(process.cwd(), "public", "uploads", "pdfs", "dont-make-women-goddesses-treat-them-like-humans.pdf");
  const stat = fs.statSync(pdfPath);

  await prisma.writing.upsert({
    where: { slug: "dont-make-women-goddesses-treat-them-like-humans" },
    update: {
      title: "Don't Make Women Goddesses, Treat Them Like Humans",
      subtitle: "Calling a woman Devi costs nothing. Giving her the rights a man already has costs a great deal more, and the distance between the two is the whole argument.",
      excerpt: "Calling a woman Devi costs nothing. Giving her the rights a man already has costs a great deal more, and the distance between the two is the whole argument.",
      content: essayContent,
      category: "Article",
      author: "Anant Yadav",
      readingTime: 7,
      publishDate: "29 September 2026",
      pdfUrl: "/uploads/pdfs/dont-make-women-goddesses-treat-them-like-humans.pdf",
      pdfFilename: "dont-make-women-goddesses-treat-them-like-humans.pdf",
      pdfSize: stat.size,
      published: true,
      featured: true,
      seoTitle: "Don't Make Women Goddesses, Treat Them Like Humans | Anant Yadav",
      seoDescription: "An urgent essay by Anant Yadav on dismantling patriarchal deification in favor of real human rights, bodily autonomy, and equal dignity.",
    },
    create: {
      title: "Don't Make Women Goddesses, Treat Them Like Humans",
      slug: "dont-make-women-goddesses-treat-them-like-humans",
      subtitle: "Calling a woman Devi costs nothing. Giving her the rights a man already has costs a great deal more, and the distance between the two is the whole argument.",
      excerpt: "Calling a woman Devi costs nothing. Giving her the rights a man already has costs a great deal more, and the distance between the two is the whole argument.",
      content: essayContent,
      category: "Article",
      author: "Anant Yadav",
      readingTime: 7,
      publishDate: "29 September 2026",
      pdfUrl: "/uploads/pdfs/dont-make-women-goddesses-treat-them-like-humans.pdf",
      pdfFilename: "dont-make-women-goddesses-treat-them-like-humans.pdf",
      pdfSize: stat.size,
      published: true,
      featured: true,
      seoTitle: "Don't Make Women Goddesses, Treat Them Like Humans | Anant Yadav",
      seoDescription: "An urgent essay by Anant Yadav on dismantling patriarchal deification in favor of real human rights, bodily autonomy, and equal dignity.",
    },
  });

  console.log("Updated exact essay in database with 5-page PDF of size:", stat.size, "bytes");
}

updateExactEssay()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
