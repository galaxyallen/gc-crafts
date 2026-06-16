import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    slug: "displays",
    num: "01",
    name: "Jewelry Displays",
    sub: "Complete counter sets — rings, earrings, bracelets, pendants",
    image: "/img/displays.webp",
    href: "/displays",
  },
  {
    slug: "trays",
    num: "02",
    name: "Jewelry Trays",
    sub: "Stackable trays, inserts, and modular platforms",
    image: "/img/trays.webp",
    href: "/trays",
  },
  {
    slug: "busts",
    num: "03",
    name: "Necklace Busts",
    sub: "Half and full busts in every material and finish",
    image: "/img/busts.jpg",
    href: "/busts",
  },
  {
    slug: "watches",
    num: "04",
    name: "Watch Displays",
    sub: "Cushions, stands, and winder-ready presentations",
    image: "/img/watches.jpg",
    href: "/watches",
  },
];

interface ProductGridProps {
  images?: Record<string, string>;
}

export function ProductGrid({ images }: ProductGridProps) {
  const cards = CATEGORIES.map((cat) => ({
    ...cat,
    image: images?.[cat.slug] ?? cat.image,
  }));

  return (
    <section className="sec prod" id="products">
      <div className="sec-bg bg-prod" />
      <div className="sec-c w">
        <div className="prod-head">
          <div>
            <div className="slb rv">The collection</div>
            <h2 className="stt rv">
              Four pillars of
              <br />
              <em>presentation</em>
            </h2>
          </div>
          <p className="rv d2">
            Each piece engineered to disappear — so only the jewel remains in the eye of the beholder.
          </p>
        </div>

        <div className="pgrid">
          {cards.map((card, i) => (
            <Link key={card.slug} href={card.href} className={`pc rv-s d${Math.min(i + 1, 4)}`}>
              <div className="pc-iw">
                <Image src={card.image} alt={card.name} width={400} height={533} loading="lazy" />
              </div>
              <div className="pc-ov">
                <div className="pc-num">{card.num}</div>
                <div className="pc-name">{card.name}</div>
                <div className="pc-sub">{card.sub}</div>
              </div>
              <div className="pc-arr">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
