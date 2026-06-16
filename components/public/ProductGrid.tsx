import Image from "next/image";
import Link from "next/link";
import { buildProductCards } from "@/lib/content";

export interface ProductCard {
  slug: string;
  num: string;
  name: string;
  sub: string;
  image: string;
  href: string;
}

interface ProductGridProps {
  cards?: ProductCard[];
}

export function ProductGrid({ cards }: ProductGridProps) {
  const items = cards ?? buildProductCards([]);

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
          {items.map((card, i) => (
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
