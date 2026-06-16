interface TrustStat {
  value: string;
  label: string;
}

interface TrustStatsProps {
  quote?: string | null;
  stats: TrustStat[];
}

function parseCounter(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (match) return { t: match[1], suffix: match[2] };
  return { t: value.replace(/\D/g, "") || "0", suffix: "" };
}

export function TrustStats({ quote, stats }: TrustStatsProps) {
  const text =
    quote ??
    "A display should never compete with its jewel. It should be felt, not seen — a presence that says this belongs here.";

  return (
    <section className="sec trust-s" id="about">
      <div className="sec-bg bg-trust" />
      <div className="sec-c w">
        <div className="trust-in">
          <div className="rv">
            <p className="tq">
              &ldquo;
              {text.replace(/this belongs here\.?/i, "").trim()}{" "}
              <em>this belongs here.</em>&rdquo;
            </p>
            <span className="tq-attr">— GC CRAFTS design philosophy</span>
          </div>
          <div className="tstats">
            {stats.map((stat, i) => {
              const { t, suffix } = parseCounter(stat.value);
              return (
                <div key={stat.label} className={`ts rv d${Math.min(i + 1, 4)}`}>
                  <div className="ts-n" data-t={t}>
                    0{suffix ? <i>{suffix}</i> : null}
                  </div>
                  <div className="ts-l">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
