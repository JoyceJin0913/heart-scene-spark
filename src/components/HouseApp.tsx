import { useState } from "react";
import { Home, Camera, Heart, Users, User, ChevronLeft, Check, Lock } from "lucide-react";
import { scenes, members, dateCard, type Scene, type Choice } from "@/data/house";

type Picked = Record<string, Choice["key"]>;

export function HouseApp() {
  const [openScene, setOpenScene] = useState<Scene | null>(null);
  const [picked, setPicked] = useState<Picked>({});
  const coreScene = scenes.find((s) => s.core)!;
  const coreDone = Boolean(picked[coreScene.id]);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <div className="flex-1 pb-24">
        {openScene ? (
          <SceneView
            scene={openScene}
            picked={picked[openScene.id]}
            onPick={(k) => setPicked((p) => ({ ...p, [openScene.id]: k }))}
            onBack={() => setOpenScene(null)}
          />
        ) : (
          <HomeView
            picked={picked}
            coreDone={coreDone}
            onOpen={(s) => setOpenScene(s)}
          />
        )}
      </div>
      <TabBar />
    </div>
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
            key={m.id}
            onClick={() => onOpen(scenes.find((s) => s.place === m.where.slice(1)) ?? hero)}
            style={{ top: m.top, left: m.left }}
            className="absolute inline-flex items-center gap-2 rounded-full glass-card px-3 py-1.5 text-xs text-foreground transition-transform hover:scale-105 active:scale-95"
          >
            <span className="grid size-5 place-items-center rounded-full bg-romance text-[10px] font-bold text-primary-foreground">
              {m.id}
            </span>
            {m.where}
          </button>
        ))}
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
              <span className="text-accent">{d.who}：</span>
              {d.line}
            </p>
          ))}
        </div>
      </div>

      <div className="px-5 pt-6">
        <h2 className="text-lg font-semibold text-primary">{scene.question}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{scene.hint}</p>

        <div className="mt-4 space-y-3">
          {scene.choices.map((c) => {
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
                  {c.key}
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

function TabBar() {
  const items = [
    { icon: Home, label: "小屋", active: true },
    { icon: Camera, label: "镜头", active: false },
    { icon: Heart, label: "心动", active: false },
    { icon: Users, label: "关系", active: false },
    { icon: User, label: "我的", active: false },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-border bg-card/90 backdrop-blur">
      <ul className="flex items-stretch justify-around px-2 py-2">
        {items.map((it) => (
          <li key={it.label}>
            <button
              disabled={!it.active}
              aria-disabled={!it.active}
              className={`flex w-16 flex-col items-center gap-1 rounded-xl py-1 text-[11px] ${
                it.active ? "text-primary" : "text-muted-foreground/50 cursor-not-allowed"
              }`}
            >
              <span className="relative">
                <it.icon className="size-5" />
                {!it.active && (
                  <Lock className="absolute -right-2 -top-1 size-2.5" aria-hidden />
                )}
              </span>
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
