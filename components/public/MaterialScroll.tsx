import Image from "next/image";
import { isUnoptimizedImage } from "@/lib/image-utils";

interface Material {
  id: number;
  name: string;
  subtitle: string;
  image: string;
}

interface MaterialScrollProps {
  materials: Material[];
}

export function MaterialScroll({ materials }: MaterialScrollProps) {
  return (
    <section className="sec mats-s" id="materials">
      <div className="sec-bg bg-mats" />
      <div className="sec-c w">
        <div className="mats-head">
          <div>
            <div className="slb rv">Materials</div>
            <h2 className="stt rv">
              Your palette,
              <br />
              <em>our craft</em>
            </h2>
          </div>
          <p className="rv d2">Every finish is available across all product lines. Mix freely.</p>
        </div>

        <div className="mscroll rv">
          {materials.map((mat) => (
            <div key={mat.id} className="mi">
              <div className="mi-sw">
                <Image
                  src={mat.image}
                  alt={mat.name}
                  width={180}
                  height={120}
                  className="mi-color"
                  loading="lazy"
                  unoptimized={isUnoptimizedImage(mat.image)}
                />
              </div>
              <div className="mi-name">{mat.name}</div>
              <div className="mi-sub">{mat.subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
