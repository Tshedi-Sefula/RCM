import type { Metadata } from "next";
import Hero from "@/components/ui/Hero";

export const metadata: Metadata = {
  title: "Our Beliefs",
  description:
    "Our vision, mission, leadership and Articles of Faith from the Restoration Center Ministries Toitskraal constitution.",
  alternates: { canonical: "/beliefs" },
};

const sections = [
  {
    title: "Our Vision",
    body: "Restoring lives, Broken marriages, Families and Futures.",
  },
  {
    title: "Our Mission",
    body: "Heal the PAST ~ Live the PRESENT ~ Dream the FUTURE. Expecting the Unexpected because of Luke 1:37, 'For with God, nothing will be impossible.'",
  },
  {
    title: "Leadership",
    body: "Pastor VVM Mashele, along with a dedicated team of elders and ministry leaders, guides our church family.",
  },
  {
    title: "History",
    body: "Founded in 2024, RCM Toitskraal has been committed to serving the community of Toitskraal and Siyabuswa through worship, teaching, and outreach programs.",
  },
];

// Official Articles of Faith (Section 5 of the Restoration Center Ministries Constitution).
const articlesOfFaith = [
  {
    title: "5.1. Triune God",
    paragraphs: [
      "There is only one true God, who has shown Himself in the Three Persons of God the Father, the Son and the Holy Spirit (Genesis 1; Matthew 3:16-17; 1 John 4:8).",
    ],
  },
  {
    title: "5.2. God the Father",
    paragraphs: [
      'The one true God has shown Himself as the everlasting self-existent "I AM", the Creator of Heaven and earth and the Redeemer of mankind. He has further shown Himself as personifying the principles of relationship as Father, Son and Holy Spirit (Deuteronomy 6:4; Isaiah 43:10; Matthew 28:19).',
    ],
  },
  {
    title: "5.3. Jesus Christ",
    paragraphs: [
      "The Lord Jesus Christ is the eternal Son of God; born of the virgin (Matthew 1:23); lived a sinless life (Hebrews 7:26); performed miracles (Acts 2:22); died on the Cross (1 Corinthians 5:21); bodily resurrected from the dead (Matthew 28:6); exalted to the right hand of God (Acts 1:9, 11).",
    ],
  },
  {
    title: "5.4. The Holy Spirit",
    paragraphs: [
      "The Divinity of the Holy Spirit who is a Co-Creator with the Father and the Son (Genesis 1:26); His role in the birth of Jesus (Matthew 1:18); gives life to believers (2 Corinthians 3:7); writes God's Law in hearts (2 Corinthians 3:3); is called to continue the work of Jesus Christ (John 14:15); is the Church's Comforter and Teacher (John 14:15-17).",
    ],
  },
  {
    title: "5.5. Holy Scriptures",
    paragraphs: [
      "The Scriptures, both Old and New Testaments, are verbally inspired of God, and are the revelation of God to man, the foolproof, authoritative rule of faith and conduct (2 Peter 1:21).",
    ],
  },
  {
    title: "5.6. Sin",
    paragraphs: [
      'Man was created good and upright; for God said, "Let us make man in our image, after our likeness". However man, by voluntary transgression, fell and suffered physical and spiritual death (separation from God) (Genesis 3:8; 23-24).',
    ],
  },
  {
    title: "5.7. Atonement",
    paragraphs: [
      "Jesus Christ, by His sufferings, shedding of His blood, and death on the Cross, made a full atonement for all human sin, and this Atonement is the only ground of salvation, sufficient for every individual of Adam's race. The Atonement is graciously valuable for the salvation of those incapable of moral responsibility and for children in innocence, and for those who reach the age of responsibility when they repent and believe (Colossians 1:19-23).",
    ],
  },
  {
    title: "5.8. Preventing Grace",
    paragraphs: [
      "The grace of God through Jesus Christ is freely given to all people, enabling all who will to turn from sin to righteousness, believe on Jesus Christ for forgiveness and cleansing from sin, and follow good works pleasing and acceptable in His sight (Galatians 6:7-8; John 3:6a; Acts 5:31).",
    ],
  },
  {
    title: "5.9. Repentance",
    paragraphs: [
      "Man's only hope of redemption is through the shed Blood of Jesus Christ. Salvation is received through repentance toward God and faith toward the Lord Jesus Christ. The internal evidence of salvation is the direct witness of the Spirit (Romans 8:16). The external evidence to all men is a life of righteousness and true holiness (Ephesians 4:24).",
    ],
  },
  {
    title: "5.10. Justification, Regeneration, and Adoption",
    paragraphs: [
      "Justification is the gracious and official act of God granting full forgiveness of all guilt and complete release from the penalty of sins committed, and acceptance as righteous, to all who believe on Jesus Christ and receive Him as Lord and Savior.",
      "Regeneration, or the new birth, is that gracious work of God whereby the moral nature of the repentant believer is spiritually accelerated and given a distinctively spiritual life, capable of faith, love, and obedience.",
      "Adoption is that gracious act of God by which the justified and regenerated believer is established as a child of God. Justification, regeneration, and adoption are simultaneous and are received by faith, led by repentance; and to this work and state of grace the Holy Spirit bears witness (Acts 13:39).",
    ],
  },
  {
    title: "5.11. Sanctification",
    paragraphs: [
      'An act of separation from evil and dedication unto God (Romans 12:1), living a life of holiness. The Scriptures teach a life of "Holiness without which no man shall see the Lord" (Hebrews 12:14). By the power of the Holy Ghost we are able to obey the command: "Be ye holy, for I am Holy" (1 Peter 1:15, 16).',
    ],
  },
  {
    title: "5.12. The Church",
    paragraphs: [
      "The Body of Christ, the dwelling of God through the Spirit, with divine appointments for the fulfillment of the great commission. Each believer, born of the Spirit, is an important part of the General Assembly and Church of the First-born, which are written in Heaven (Hebrews 12:23). A divinely called and scripturally ordained ministry has been provided by our Lord for a two-fold purpose: to evangelize the World and to edify the Body of Christ (Mark 16:15-20).",
    ],
  },
  {
    title: "5.13. Sacraments",
    paragraphs: [
      "Baptism in Water (by immersion): The ordinance of Baptism by immersion is commanded in the Scriptures. All who repent and believe in Christ as Savior and Lord are to be baptized, declaring to the world that they have died with Christ and have been raised with Him to walk in newness of life (Mark 16:16).",
      'Holy Communion (bread and wine): The Lord\'s Supper, consisting of the elements—bread and wine—is the symbolic expression of our sharing in the divine nature of our Lord Jesus Christ (2 Peter 1:4); a memorial of His suffering and death (1 Corinthians 11:26); and is charged on all believers "till He comes!"',
      "Divine Healing: An integral part of the Gospel. Deliverance from sickness is provided for in the atonement, and is the privilege of all believers (Isaiah 53:4, 5).",
      "Child Dedication: Children are a blessing from the Lord and an inheritance to their parents. Just as Jesus called the little children to Himself, it is important that parents dedicate their children to the Lord in their upbringing (Luke 18:15).",
    ],
  },
  {
    title: "5.14. Second Coming",
    paragraphs: [
      "The rapture of the saints, followed by the visible return of Christ with His saints to reign on the earth for one thousand years (Matthew 24:27). This millennial reign will bring the salvation of general Israel (Ezekiel 37:21, 22) and the formation of worldwide peace (Psalm 72:3-8).",
    ],
  },
  {
    title: "5.15. Resurrection, Judgment, and Destiny",
    paragraphs: [
      "The resurrection of the saved to eternal life, and the final judgment of the wicked. The resurrection of those who have fallen asleep in Christ and their translation together with those who are alive and remain unto the coming of the Lord is the pending and Blessed Hope of the Church (1 Thessalonians 4:16, 17).",
      'There will be a final judgment in which the wicked dead will be raised and judged according to their works (Mark 9:43-48). "We, according to His promise, look for new heavens and a new earth, wherein dwelleth righteousness" (Revelation 21:22).',
    ],
  },
];

export default function BeliefsPage() {
  return (
    <>
      <Hero title="Our Beliefs" image="/images/about-hero.jpg" />
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-16 sm:grid-cols-2">
        {sections.map((s) => (
          <article key={s.title} className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-brand-muted">{s.body}</p>
          </article>
        ))}
      </section>

      <section className="bg-white py-16 sm:py-24">
        <article className="prose prose-lg prose-stone mx-auto px-4 prose-headings:font-display prose-headings:font-semibold prose-h2:text-brand-primary">
          <h2>5. Articles of Faith</h2>
          <p className="lead">
            These articles are a basis of fellowship for the brethren, so that we all speak and do the same things as
            inspired by the Bible, our all-sufficient rule for faith and practice.
          </p>
          {articlesOfFaith.map((article) => (
            <section key={article.title}>
              <h3>{article.title}</h3>
              {article.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </section>
    </>
  );
}
