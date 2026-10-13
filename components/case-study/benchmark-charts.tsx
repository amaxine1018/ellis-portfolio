import type {
  BenchmarkChart,
  BenchmarkLegendItem,
  BenchmarkSeries,
} from "@/lib/case-studies/types";

const DOT: Record<BenchmarkSeries, string> = {
  v1: "/assets/case-studies/reimagining/chart-dot-v1.svg",
  v2: "/assets/case-studies/reimagining/chart-dot-v2.svg",
};

const GRID = "/assets/case-studies/reimagining/chart-grid.svg";
const TICK = "/assets/case-studies/reimagining/chart-tick.svg";
const CES_WASH = "/assets/case-studies/reimagining/chart-ces-gradient.svg";

interface BenchmarkChartsProps {
  legend: BenchmarkLegendItem[];
  charts: BenchmarkChart[];
}

export function BenchmarkCharts({ legend, charts }: BenchmarkChartsProps) {
  return (
    <div className="mt-8 flex flex-col items-center gap-8 sm:mt-12 sm:gap-10">
      <div className="flex flex-wrap items-center justify-center gap-x-[30px] gap-y-3">
        {legend.map((item) => (
          <div key={item.series} className="flex items-center gap-[30px]">
            <img src={DOT[item.series]} alt="" />
            <span className="font-mono text-base leading-[30px] text-black sm:text-xl">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-[78px]">
        {charts.map((chart) => (
          <ChartPanel key={chart.title} chart={chart} />
        ))}
      </div>
    </div>
  );
}

function ChartPanel({ chart }: { chart: BenchmarkChart }) {
  return (
    <figure className="min-w-0">
      <figcaption className="mb-4 text-center font-mono text-xl font-bold text-text-primary sm:mb-6 sm:text-2xl">
        {chart.title}
      </figcaption>
      <div className="relative h-[280px] sm:h-[320px]">
        {chart.wash === "top" ? (
          <div
            className="pointer-events-none absolute top-0 right-0 left-3 h-1/2 rounded-lg"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in srgb, var(--green-200) 70%, transparent), color-mix(in srgb, var(--green-200) 6%, transparent))",
            }}
          />
        ) : (
          <img
            src={CES_WASH}
            alt=""
            className="pointer-events-none absolute bottom-3 left-3 h-[54%] w-[calc(100%-0.75rem)] scale-y-[-1] object-fill"
          />
        )}
        <img
          src={GRID}
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-fill"
        />
        {chart.points.map((point) => (
          <div
            key={`${chart.title}-${point.series}-${point.label}`}
            className="absolute z-10 flex -translate-y-1/2 items-center gap-1.5"
            style={{ top: `${point.top}%`, left: `${point.left}%` }}
          >
            <img src={DOT[point.series]} alt="" />
            <span className="font-mono text-base font-light leading-[30px] text-black sm:text-xl">
              <span className="sr-only">
                {point.series === "v1" ? "v1 benchmark " : "v2 benchmark "}
              </span>
              {point.label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-1 h-10">
        {chart.categories.map((category) => (
          <div
            key={category.label}
            className="absolute -top-3 flex -translate-x-1/2 flex-col items-center gap-[5px]"
            style={{ left: `${category.left}%` }}
          >
            <img src={TICK} alt="" />
            <span className="font-mono text-sm leading-[30px] whitespace-nowrap text-text-primary sm:text-xl">
              {category.label}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}
