import Image from "next/image";

interface CapabilityItem {
  title?: string | null;
  body?: string | null;
  image?: string | null;
}

interface CapabilitySectionProps {
  design: CapabilityItem;
  manufacture: CapabilityItem;
  deliver: CapabilityItem;
}

export function CapabilitySection({ design, manufacture, deliver }: CapabilitySectionProps) {
  const items = [
    { ...design, num: "01", label: design.title ?? "Design", image: design.image ?? "/img/detail1.webp" },
    { ...manufacture, num: "02", label: manufacture.title ?? "Manufacture", image: manufacture.image ?? "/img/factory.jpg" },
    { ...deliver, num: "03", label: deliver.title ?? "Deliver", image: deliver.image ?? "/img/detail3.webp" },
  ];

  return (
    <section className="sec capa-s" id="process">
      <div className="sec-bg bg-capa" />
      <div className="sec-c w">
        <div className="capa-intro">
          <div>
            <div className="slb rv">How we work</div>
            <h2 className="stt rv">
              One studio.
              <br />
              <em>Every step.</em>
            </h2>
          </div>
          <p className="rv d2">
            Most suppliers assemble. We originate. From the first sketch to the final stitch, your display never
            leaves our hands until it reaches yours.
          </p>
        </div>

        <div className="cgrid">
          {items.map((item, i) => (
            <article key={item.num} className={`cc rv d${Math.min(i + 1, 3)}`}>
              <div className="cc-img">
                <Image src={item.image} alt={item.label} width={480} height={384} loading="lazy" />
              </div>
              <div className="cc-n">
                <span>{item.num}</span>
                <span>{item.label}</span>
              </div>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
