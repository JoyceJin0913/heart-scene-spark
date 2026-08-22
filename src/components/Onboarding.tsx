import { useState } from "react";
import { Heart, ArrowRight, Check } from "lucide-react";

export type PlayerSetup = {
  name: string;
  gender: "m" | "f";
  age: number;
  zodiac: string;
};

const ZODIACS = [
  "白羊",
  "金牛",
  "双子",
  "巨蟹",
  "狮子",
  "处女",
  "天秤",
  "天蝎",
  "射手",
  "摩羯",
  "水瓶",
  "双鱼",
];

const AGES = Array.from({ length: 15 }, (_, i) => 18 + i);

export function Onboarding({ onStart }: { onStart: (p: PlayerSetup) => void }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"m" | "f" | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [zodiac, setZodiac] = useState<string | null>(null);

  const done = [name.trim().length > 0, !!gender, !!age, !!zodiac];
  const ready = done.every(Boolean);

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-female/25 blur-[90px]" />

      <div className="relative flex-1 overflow-y-auto px-6 pb-32 pt-12">
        {/* logo */}
        <div className="flex flex-col items-center text-center">
          <span className="grid size-[76px] place-items-center rounded-full bg-gradient-to-br from-female to-primary shadow-[0_0_50px_-8px_color-mix(in_oklab,var(--female)_70%,transparent)]">
            <Heart className="size-8 text-background" strokeWidth={2.4} />
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-[0.35em] text-female">心动岛</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            七天，一座小屋，五个人。
            <br />
            你会先心动，还是先看清自己？
          </p>
        </div>

        {/* progress */}
        <div className="mt-8 flex items-center gap-1.5">
          {done.map((ok, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${ok ? "bg-female" : "bg-border"}`}
            />
          ))}
        </div>

        <div className="mt-6 space-y-5">
          <Field label="你的名字" hint="节目里大家怎么称呼你" filled={done[0]}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={12}
              placeholder="输入你的名字"
              className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-female"
            />
          </Field>

          <Field label="你的性别" hint="决定小屋里的异性阵容" filled={done[1]}>
            <div className="grid grid-cols-2 gap-3">
              {([
                { k: "m" as const, label: "男生", cls: "border-male bg-male/15 text-male" },
                { k: "f" as const, label: "女生", cls: "border-female bg-female/15 text-female" },
              ]).map((o) => (
                <button
                  key={o.k}
                  onClick={() => setGender(o.k)}
                  className={`rounded-2xl border py-3.5 text-sm font-medium transition-colors ${
                    gender === o.k
                      ? o.cls
                      : "border-border text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="你的年龄" filled={done[2]}>
            <div className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-2 pb-1">
                {AGES.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm tabular-nums transition-colors ${
                      age === a
                        ? "border-female bg-female/15 text-female"
                        : "border-border text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </Field>

          <Field label="你的星座" filled={done[3]}>
            <div className="grid grid-cols-4 gap-2">
              {ZODIACS.map((z) => (
                <button
                  key={z}
                  onClick={() => setZodiac(z)}
                  className={`rounded-xl border py-2.5 text-[13px] transition-colors ${
                    zodiac === z
                      ? "border-female bg-female/15 text-female"
                      : "border-border text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </div>

      {/* sticky CTA */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent px-6 pb-7 pt-8">
        <button
          disabled={!ready}
          onClick={() =>
            ready &&
            onStart({ name: name.trim(), gender: gender!, age: age!, zodiac: zodiac! })
          }
          className={`pointer-events-auto flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-medium transition-all active:scale-[0.98] ${
            ready
              ? "bg-gradient-to-r from-female to-primary text-background shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--female)_80%,transparent)]"
              : "cursor-not-allowed bg-secondary/50 text-muted-foreground"
          }`}
        >
          {ready ? "进入心动岛" : "先把上面填完"}
          {ready && <ArrowRight className="size-4" />}
        </button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          七天旅程 · 每天 3 件事 · 结果决定你的心动档案
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  filled,
  children,
}: {
  label: string;
  hint?: string;
  filled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-center gap-2">
        <h2 className="text-[13px] font-medium">{label}</h2>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
        {filled && <Check className="ml-auto size-3.5 text-female" />}
      </div>
      {children}
    </section>
  );
}
