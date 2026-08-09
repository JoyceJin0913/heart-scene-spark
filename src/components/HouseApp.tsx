import { useEffect, useRef, useState } from "react";

import {
  Home,
  Heart,
  User,
  ChevronLeft,
  Check,
  Lock,
  ChevronRight,
} from "lucide-react";
import {
  scenes,
  members,
  dateCard,
  genderOf,
  avatarOf,
  relationshipCards,
  relationshipGraph,
  meAvatar,
  profile,
  storyTimeline,
  type Scene,
  type Choice,
  type Member,
} from "@/data/house";

type TabKey = "house" | "relationships" | "me";
type Picked = Record<string, Choice["key"]>;

export function HouseApp() {
  const [tab, setTab] = useState<TabKey>("house");
  const [openScene, setOpenScene] = useState<Scene | null>(null);
  const [picked, setPicked] = useState<Picked>({});
  const coreScene = scenes.find((s) => s.core)!;
  const coreDone = Boolean(picked[coreScene.id]);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <div className="flex-1 pb-24">
        {tab === "house" && (
          <HouseContent
            openScene={openScene}
            picked={picked}
            coreDone={coreDone}
            onOpen={(s) => setOpenScene(s)}
            onPick={(id, k) => setPicked((p) => ({ ...p, [id]: k }))}
            onBack={() => setOpenScene(null)}
          />
        )}
        {tab === "relationships" && <RelationshipsView />}
        {tab === "me" && <MeView />}
      </div>
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}

function HouseContent({
  openScene,
  picked,
  coreDone,
  onOpen,
  onPick,
  onBack,
}: {
  openScene: Scene | null;
  picked: Picked;
  coreDone: boolean;
  onOpen: (s: Scene) => void;
  onPick: (id: string, k: Choice["key"]) => void;
  onBack: () => void;
}) {
  if (openScene) {
    return (
      <SceneView
        scene={openScene}
        picked={picked[openScene.id]}
        onPick={(k) => onPick(openScene.id, k)}
        onBack={onBack}
      />
    );
  }

  return (
    <HomeView
      picked={picked}
      coreDone={coreDone}
      onOpen={onOpen}
    />
  );
}

function HomeView({
  picked,
  coreDone,
  onOpen,
}: {
  picked: Picked;
  coreDone: boolean;
  onOpen: (s: Scene) => void;
}) {
  const coreScene = scenes.find((s) => s.core)!;
  const hero = scenes[1]!;
  const done = Object.keys(picked).length;

  return (
    <div>
      <header className="px-5 pt-8 text-center">
        <h1 className="text-3xl font-semibold tracking-[0.3em] text-primary">小屋</h1>
        <p className="mt-2 text-sm text-muted-foreground">今天的小屋生活</p>
      </header>

      <section className="relative mt-5 overflow-hidden rounded-3xl mx-4 shadow-glow">
        <img
          src={hero.image}
          alt="小屋客厅的夜晚，成员们围坐聊天"
          width={1024}
          height={1280}
          className="h-[380px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-night-fade" />

        <div className="absolute inset-x-0 top-5 text-center">
          <p className="text-2xl font-semibold text-foreground drop-shadow">Day 04</p>
          <p className="mt-1 text-sm text-foreground/80">20:37 🌙</p>
        </div>

        {members.map((m) => (
          <button
            key={m.name}
            onClick={() => onOpen(scenes.find((s) => s.place === m.where.slice(1)) ?? hero)}
            style={{ top: m.top, left: m.left }}
            className="absolute inline-flex items-center gap-1.5 rounded-full glass-card px-2.5 py-1 text-[11px] text-foreground transition-transform hover:scale-105 active:scale-95"
          >
            <span
              className={`size-2 rounded-full ${m.gender === "m" ? "bg-male" : "bg-female"}`}
              aria-hidden
            />
            <span className={m.gender === "m" ? "text-male" : "text-female"}>{m.name}</span>
            <span className="text-foreground/70">{m.where}</span>
          </button>
        ))}
      </section>

      <section className="mt-4 px-5">
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-male" aria-hidden /> 男生 5
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-female" aria-hidden /> 女生 5
          </span>
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-semibold">今天发生了 {scenes.length} 件事</h2>
          <span className="text-xs text-muted-foreground">已参与 {done}/{scenes.length}</span>
        </div>

        <ul className="mt-3 space-y-3">
          {scenes.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => onOpen(s)}
                className="flex w-full items-center gap-3 rounded-2xl glass-card p-3 text-left transition-colors hover:bg-secondary/60"
              >
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="size-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {s.place} · {s.time}
                  </p>
                </div>
                {picked[s.id] ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[11px] text-accent">
                    <Check className="size-3" /> 已选择
                  </span>
                ) : (
                  s.core && (
                    <span className="rounded-full bg-romance px-2 py-1 text-[11px] font-medium text-primary-foreground">
                      核心
                    </span>
                  )
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-5">
        <div className="rounded-2xl glass-card p-4">
          <p className="text-xs tracking-widest text-accent">约会</p>
          <p className="mt-1 text-sm font-medium">{dateCard.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{dateCard.time}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{dateCard.desc}</p>
        </div>
      </section>

      <div className="px-5 py-6">
        <button
          onClick={() => onOpen(coreScene)}
          className="w-full rounded-full bg-romance py-4 text-base font-semibold text-primary-foreground shadow-glow transition-transform active:scale-[0.98]"
        >
          {coreDone ? "回顾今天的核心选择" : "去看看"}
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          每天 3~5 个关键事件 · 每天 1 次核心选择
        </p>
      </div>
    </div>
  );
}

function SceneView({
  scene,
  picked,
  onPick,
  onBack,
}: {
  scene: Scene;
  picked?: Choice["key"] | undefined;
  onPick: (k: Choice["key"]) => void;
  onBack: () => void;
}) {
  const chosen = scene.choices.find((c) => c.key === picked);

  return (
    <div>
      <div className="relative">
        <img
          src={scene.image}
          alt={scene.title}
          width={1024}
          height={1280}
          className="h-[340px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-night-fade" />
        <div className="absolute inset-x-0 top-6 flex items-center px-4">
          <button
            onClick={onBack}
            aria-label="返回小屋"
            className="grid size-9 place-items-center rounded-full glass-card"
          >
            <ChevronLeft className="size-5" />
          </button>
          <p className="flex-1 text-center text-sm font-medium">
            {scene.place} · {scene.time}
          </p>
          <span className="size-9" />
        </div>

        <div className="absolute inset-x-4 bottom-4 rounded-2xl glass-card px-4 py-3">
          {scene.dialogue.map((d, i) => (
            <p key={i} className="py-0.5 text-sm text-foreground/90">
              <span className={genderOf(d.who) === "m" ? "text-male" : "text-female"}>
                {d.who}：
              </span>
              {d.line}
            </p>
          ))}
        </div>
      </div>

      <div className="px-5 pt-6">
        <h2 className="text-lg font-semibold text-primary">{scene.question}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{scene.hint}</p>

        <div className="mt-4 space-y-3">
          {scene.choices.map((c, i) => {
            const active = picked === c.key;

            return (
              <button
                key={c.key}
                onClick={() => onPick(c.key)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                  active
                    ? "border-primary bg-secondary shadow-glow"
                    : "border-border bg-card/70 hover:bg-secondary/60"
                }`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    active ? "bg-romance text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-sm">{c.label}</span>
              </button>
            );
          })}
        </div>

        {chosen && (
          <div className="mt-5 rounded-2xl glass-card p-4">
            <p className="text-xs tracking-widest text-accent">剧情走向</p>
            <p className="mt-2 text-sm leading-relaxed">{chosen.result}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {chosen.effects.map((e) => (
                <span
                  key={e.name}
                  className="rounded-full bg-secondary px-3 py-1 text-[11px] text-foreground/90"
                >
                  {e.name} {e.delta > 0 ? `+${e.delta}` : e.delta}
                </span>
              ))}
            </div>
            <button
              onClick={onBack}
              className="mt-4 w-full rounded-full bg-romance py-3 text-sm font-semibold text-primary-foreground"
            >
              回到小屋
            </button>
          </div>
        )}
        <div className="h-8" />
      </div>
    </div>
  );
}

function RelationshipsView() {
  const [subTab, setSubTab] = useState<"moments" | "dynamics">("moments");

  return (
    <div className="px-5 pt-8">
      <header className="text-center">
        <p className="text-xs tracking-widest text-accent">关系</p>
        <h1 className="mt-1 text-2xl font-semibold text-primary">关系</h1>
        <p className="mt-2 text-sm text-muted-foreground">你们之间，发生了什么？</p>
      </header>

      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <button
          onClick={() => setSubTab("moments")}
          className={`pb-1 transition-colors ${
            subTab === "moments"
              ? "border-b-2 border-primary font-medium text-primary"
              : "text-muted-foreground"
          }`}
        >
          心动瞬间
        </button>
        <button
          onClick={() => setSubTab("dynamics")}
          className={`pb-1 transition-colors ${
            subTab === "dynamics"
              ? "border-b-2 border-primary font-medium text-primary"
              : "text-muted-foreground"
          }`}
        >
          关系动态
        </button>
      </div>

      {subTab === "moments" ? (
        <div className="mt-5 space-y-3">
          {relationshipCards.map((card) => (
            <RelationshipCard key={card.name} card={card} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl glass-card p-4 text-center">
          <p className="text-sm text-muted-foreground">关系动态将在明天的约会后更新。</p>
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-base font-semibold">关系走向</h2>
        <div className="relative mt-4 h-72 rounded-3xl glass-card overflow-hidden">
          <RelationshipGraph />
        </div>
      </section>

      <div className="mt-4 flex items-center justify-center gap-1 text-sm text-muted-foreground">
        <span>查看完整关系图</span>
        <ChevronRight className="size-4" />
      </div>

      <div className="h-8" />
    </div>
  );
}

function RelationshipCard({ card }: { card: { name: string; value: number; desc: string; meta: string; active: boolean } }) {
  const member = members.find((m) => m.name === card.name) as Member;
  const avatar = avatarOf(card.name);
  const isFemale = member.gender === "f";

  return (
    <div className="flex items-center gap-4 rounded-2xl glass-card p-3">
      <div className="relative shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={card.name}
            loading="lazy"
            width={64}
            height={64}
            className="size-16 rounded-2xl object-cover"
          />
        ) : (
          <div className="grid size-16 place-items-center rounded-2xl bg-secondary text-lg font-medium">
            {card.name[0]}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold ${isFemale ? "text-female" : "text-male"}`}>
              {card.name}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            心动值 <span className={card.active ? "text-female" : "text-muted-foreground"}>{card.value}</span>
          </span>
        </div>

        <p className="mt-1 text-sm text-foreground">{card.desc}</p>
        <p className="mt-1 text-xs text-muted-foreground">{card.meta}</p>
      </div>

      <Heart
        className={`size-5 shrink-0 ${card.active ? "fill-female text-female" : "text-muted-foreground"}`}
        strokeWidth={card.active ? 1.5 : 2}
      />
    </div>
  );
}

function RelationshipGraph() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement | null>());
  const [lines, setLines] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);

  const updateLines = () => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const next = relationshipGraph.edges
      .map(([a, b]) => {
        const aEl = nodeRefs.current.get(a);
        const bEl = nodeRefs.current.get(b);
        if (!aEl || !bEl) return null;
        const aRect = aEl.getBoundingClientRect();
        const bRect = bEl.getBoundingClientRect();
        return {
          x1: aRect.left + aRect.width / 2 - cRect.left,
          y1: aRect.top + aRect.height / 2 - cRect.top,
          x2: bRect.left + bRect.width / 2 - cRect.left,
          y2: bRect.top + bRect.height / 2 - cRect.top,
        };
      })
      .filter((x): x is { x1: number; y1: number; x2: number; y2: number } => x !== null);
    setLines(next);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(updateLines);
    const onResize = () => updateLines();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <svg className="absolute inset-0 h-full w-full pointer-events-none">
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="currentColor"
            className="text-border"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {relationshipGraph.nodes.map((n) => {
        const member = members.find((m) => m.name === n.name)!;
        const avatar = avatarOf(n.name);

        return (
          <button
            key={n.name}
            ref={(el) => { nodeRefs.current.set(n.name, el); }}
            style={{ top: n.top, left: n.left, transform: "translate(-50%, -50%)" }}
            className="absolute flex flex-col items-center gap-1"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={n.name}
                loading="lazy"
                width={56}
                height={56}
                className="size-14 rounded-full border-2 border-card object-cover shadow"
              />
            ) : (
              <div className="grid size-14 place-items-center rounded-full border-2 border-card bg-secondary text-sm font-medium shadow">
                {n.name[0]}
              </div>
            )}
            <span className={`text-xs ${member.gender === "f" ? "text-female" : "text-male"}`}>
              {n.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}


function MeView() {
  return (
    <div className="px-5 pt-8">
      <header className="text-center">
        <p className="text-xs tracking-[0.25em] text-accent">我的恋综档案</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[0.2em] text-primary">
          我的恋综档案
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">记录你的心动旅程</p>
      </header>

      <section className="mt-6 rounded-3xl glass-card p-5">
        <div className="flex items-center gap-4">
          <img
            src={meAvatar}
            alt="你的头像"
            width={512}
            height={512}
            className="size-16 rounded-full border-2 border-card object-cover shadow"
          />
          <div className="flex-1">
            <p className="text-lg font-semibold text-primary">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.day}</p>
          </div>
          <div className="flex gap-3">
            <button className="grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground">
              <span className="text-sm">♀</span>
            </button>
            <button className="grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground">
              <span className="text-sm">⚙</span>
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-secondary/60 p-3">
            <p className="text-xs text-muted-foreground">心动对象</p>
            <p className="mt-1 text-lg font-semibold text-primary">{profile.target}</p>
          </div>
          <div className="rounded-2xl bg-secondary/60 p-3">
            <p className="text-xs text-muted-foreground">心动值</p>
            <p className="mt-1 text-lg font-semibold text-primary">{profile.value}</p>
          </div>
          <div className="rounded-2xl bg-secondary/60 p-3">
            <p className="text-xs text-muted-foreground">戳心时刻</p>
            <p className="mt-1 text-lg font-semibold text-primary">{profile.moments}刻</p>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="text-base font-semibold">我的故事</h2>
        </div>

        <div className="relative mt-3 rounded-3xl glass-card p-5">
          <div className="absolute left-8 top-5 bottom-5 w-px bg-border" aria-hidden />

          <ul className="relative space-y-5">
            {storyTimeline.map((item, index) => (
              <li key={item.day} className="flex items-center gap-4">
                <span
                  className={`relative z-10 grid size-3 place-items-center rounded-full ${
                    index === storyTimeline.length - 1 ? "bg-romance" : "bg-border"
                  }`}
                  aria-hidden
                />
                <span className="w-12 text-xs text-muted-foreground">{item.day}</span>
                <span className={`text-sm ${index === storyTimeline.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {item.title}
                </span>
              </li>
            ))}
          </ul>

          <button className="mt-5 flex w-full items-center justify-center gap-1 rounded-2xl bg-secondary/70 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
            回顾全部故事
            <ChevronRight className="size-4" />
          </button>
        </div>
      </section>

      <div className="h-6" />
    </div>
  );
}

function TabBar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  const items: { key: TabKey; icon: typeof Home; label: string }[] = [
    { key: "house", icon: Home, label: "小屋" },
    { key: "relationships", icon: Heart, label: "心动 · 观察关系" },
    { key: "me", icon: User, label: "我的 · 沉淀故事" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-border bg-card/90 backdrop-blur">
      <ul className="flex items-stretch justify-around px-2 py-2">
        {items.map((it) => {
          const isActive = active === it.key && !it.disabled;
          return (
            <li key={it.key}>
              <button
                disabled={it.disabled}
                onClick={() => !it.disabled && onChange(it.key)}
                aria-disabled={it.disabled}
                className={`flex flex-col items-center gap-1 rounded-xl py-1 px-2 text-[11px] ${
                  isActive
                    ? "text-primary"
                    : it.disabled
                    ? "text-muted-foreground/50 cursor-not-allowed"
                    : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  <it.icon className="size-5" />
                  {it.disabled && (
                    <Lock className="absolute -right-2 -top-1 size-2.5" aria-hidden />
                  )}
                </span>
                {it.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
