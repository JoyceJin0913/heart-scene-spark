import { useState } from "react";
import { ChevronLeft, Heart, MessageSquareHeart, Gamepad2, NotebookPen } from "lucide-react";

import { avatarOf, genderOf } from "@/data/house";
import type { ChatLogEntry } from "@/components/HouseApp";

type Mode = "menu" | "sms" | "game" | "review";

const SMS_TEMPLATES = [
  { key: "goodnight", text: "今天最后一句话想说给你听：晚安。", gain: 4 },
  { key: "kitchen", text: "刚才那段对话，我回房间之后又想了一遍。", gain: 6 },
  { key: "tomorrow", text: "明天的约会，如果可以选，我还是想选你。", gain: 8 },
];

const SMS_REPLIES = [
  "……我也刚好在想同一件事。",
  "收到了。明天见，别熬太晚。",
  "你怎么总是挑我最没防备的时候说这种话。",
];

const QUIZ = [
  {
    q: "今晚厨房里，温宁把碗放回水槽前说了什么？",
    options: ["「我也不知道该怎么说。」", "「你先出去吧。」", "「明天再说。」"],
    answer: 0,
  },
  {
    q: "阳台上，沈知最后做了什么？",
    options: ["转身离开", "把烟火递了过去", "叫来了林一"],
    answer: 1,
  },
  {
    q: "客厅里，是谁提议抽签决定分组？",
    options: ["夏可", "沈知", "苏杳"],
    answer: 2,
  },
];

const REVIEW_PROMPTS = [
  "今天谁的反应，让你想多看一眼？",
  "如果今天只能重来一句话，你会改哪一句？",
  "明天你最想靠近谁？",
];

export function RoomNight({
  chatLog,
  onLeave,
}: {
  chatLog: ChatLogEntry[];
  onLeave: () => void;
}) {
  const [mode, setMode] = useState<Mode>("menu");
  const [heart, setHeart] = useState(0);

  const talked = Array.from(new Set(chatLog.map((c) => c.name)));

  return (
    <div className="min-h-[100dvh] pb-8">
      <header className="flex items-center gap-2 px-5 pt-6">
        {mode === "menu" ? (
          <button
            onClick={onLeave}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary/60"
            aria-label="回到小屋"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : (
          <button
            onClick={() => setMode("menu")}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary/60"
            aria-label="返回房间"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        <div className="flex-1">
          <p className="text-[11px] tracking-[0.3em] text-muted-foreground">23:00 · Day 04</p>
          <h1 className="text-lg font-semibold">我的房间</h1>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full glass-card px-2.5 py-1 text-xs text-primary">
          <Heart className="size-3.5 fill-current" /> +{heart}
        </span>
      </header>

      {mode === "menu" && (
        <div className="mt-6 space-y-3 px-5 animate-fade-in">
          <RoomEntry
            icon={<MessageSquareHeart className="size-5 text-female" />}
            title="发送心动短信"
            desc="睡前给今天聊过的人发一条只有 TA 会看到的话"
            onClick={() => setMode("sms")}
          />
          <RoomEntry
            icon={<Gamepad2 className="size-5 text-male" />}
            title="玩心动小游戏"
            desc="回忆今天的三件事，答对越多，心动值越高"
            onClick={() => setMode("game")}
          />
          <RoomEntry
            icon={<NotebookPen className="size-5 text-accent" />}
            title="复盘思考"
            desc="把今天没说出口的话，写给自己"
            onClick={() => setMode("review")}
          />

          <p className="pt-4 text-center text-[11px] text-muted-foreground">
            今天你和 {talked.length} 个人说过话
          </p>
        </div>
      )}

      {mode === "sms" && (
        <SmsPanel names={talked} onGain={(g) => setHeart((h) => h + g)} />
      )}
      {mode === "game" && <GamePanel onGain={(g) => setHeart((h) => h + g)} />}
      {mode === "review" && <ReviewPanel />}
    </div>
  );
}

function RoomEntry({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-2xl glass-card p-4 text-left transition-colors hover:bg-secondary/60 active:scale-[0.99]"
    >
      <span className="mt-0.5">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}

function SmsPanel({ names, onGain }: { names: string[]; onGain: (g: number) => void }) {
  const [to, setTo] = useState<string | null>(names[0] ?? null);
  const [sent, setSent] = useState<{ text: string; reply: string } | null>(null);

  return (
    <div className="mt-5 px-5 animate-fade-in">
      <h2 className="text-sm font-medium">发送心动短信</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {names.map((n) => (
          <button
            key={n}
            onClick={() => {
              setTo(n);
              setSent(null);
            }}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
              to === n
                ? genderOf(n) === "m"
                  ? "border-male bg-male/15 text-male"
                  : "border-female bg-female/15 text-female"
                : "border-border text-muted-foreground"
            }`}
          >
            {avatarOf(n) && (
              <img src={avatarOf(n)} alt={n} className="size-4 rounded-full object-cover" />
            )}
            {n}
          </button>
        ))}
      </div>

      {!to && (
        <p className="mt-4 rounded-2xl border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
          今天还没和谁说过话，明天再试试。
        </p>
      )}

      {to && !sent && (
        <ul className="mt-4 space-y-2">
          {SMS_TEMPLATES.map((t, i) => (
            <li key={t.key}>
              <button
                onClick={() => {
                  onGain(t.gain);
                  setSent({ text: t.text, reply: SMS_REPLIES[i]! });
                }}
                className="w-full rounded-2xl glass-card px-3 py-3 text-left text-xs leading-relaxed transition-colors hover:bg-secondary/60"
              >
                {t.text}
                <span className="mt-1 block text-[11px] text-primary">心动 +{t.gain}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {to && sent && (
        <div className="mt-4 space-y-2 animate-fade-in">
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-xs leading-relaxed text-primary-foreground">
            {sent.text}
          </div>
          <div className="mr-auto max-w-[80%] rounded-2xl rounded-bl-sm glass-card px-3 py-2 text-xs leading-relaxed">
            {to}：{sent.reply}
          </div>
          <p className="pt-2 text-center text-[11px] text-muted-foreground">
            今晚只能发一条。收起手机，睡吧。
          </p>
        </div>
      )}
    </div>
  );
}

function GamePanel({ onGain }: { onGain: (g: number) => void }) {
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  const q = QUIZ[step];

  if (!q) {
    return (
      <div className="mt-10 px-8 text-center animate-fade-in">
        <p className="text-sm text-muted-foreground">今晚的回忆小游戏结束</p>
        <p className="mt-3 text-3xl font-semibold text-primary">
          {correct} / {QUIZ.length}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          你记住的细节，会变成明天你能说出口的话。
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 px-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">心动小游戏 · 今天你记得多少</h2>
        <span className="text-[11px] text-muted-foreground">
          {step + 1}/{QUIZ.length}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed">{q.q}</p>
      <ul className="mt-3 space-y-2">
        {q.options.map((o, i) => {
          const revealed = chosen !== null;
          const isRight = i === q.answer;
          return (
            <li key={o}>
              <button
                disabled={revealed}
                onClick={() => {
                  setChosen(i);
                  if (isRight) {
                    setCorrect((c) => c + 1);
                    onGain(5);
                  }
                }}
                className={`w-full rounded-2xl border px-3 py-3 text-left text-xs leading-relaxed transition-colors ${
                  revealed && isRight
                    ? "border-primary bg-primary/10 text-foreground"
                    : revealed && chosen === i
                      ? "border-destructive/60 text-muted-foreground"
                      : "border-border hover:bg-secondary/60"
                }`}
              >
                {o}
              </button>
            </li>
          );
        })}
      </ul>
      {chosen !== null && (
        <button
          onClick={() => {
            setStep((s) => s + 1);
            setChosen(null);
          }}
          className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
        >
          {step === QUIZ.length - 1 ? "看看结果" : "下一题"}
        </button>
      )}
    </div>
  );
}

function ReviewPanel() {
  const [i, setI] = useState(0);
  const [notes, setNotes] = useState<string[]>(["", "", ""]);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mt-5 space-y-3 px-5 animate-fade-in">
        <h2 className="text-sm font-medium">今天的复盘</h2>
        {REVIEW_PROMPTS.map((p, k) => (
          <div key={p} className="rounded-2xl glass-card p-3">
            <p className="text-[11px] text-muted-foreground">{p}</p>
            <p className="mt-1 text-xs leading-relaxed">{notes[k] || "（没有写）"}</p>
          </div>
        ))}
        <p className="pt-2 text-center text-[11px] text-muted-foreground">
          写下来的部分，会留在「我的 · 沉淀故事」里。
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 px-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">复盘思考</h2>
        <span className="text-[11px] text-muted-foreground">
          {i + 1}/{REVIEW_PROMPTS.length}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed">{REVIEW_PROMPTS[i]}</p>
      <textarea
        value={notes[i]}
        onChange={(e) =>
          setNotes((n) => n.map((v, k) => (k === i ? e.target.value : v)))
        }
        rows={4}
        placeholder="写给自己就好，没有人会看到。"
        className="mt-3 w-full rounded-2xl border border-border bg-transparent p-3 text-xs leading-relaxed outline-none placeholder:text-muted-foreground focus:border-primary"
      />
      <button
        onClick={() => (i === REVIEW_PROMPTS.length - 1 ? setDone(true) : setI(i + 1))}
        className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
      >
        {i === REVIEW_PROMPTS.length - 1 ? "写完了" : "下一个"}
      </button>
    </div>
  );
}
