import living from "@/assets/scene-living.jpg";
import kitchen from "@/assets/scene-kitchen.jpg";
import balcony from "@/assets/scene-balcony.jpg";

export type Gender = "m" | "f";

export type Choice = {
  key: "A" | "B" | "C";
  label: string;
  result: string;
  effects: { name: string; delta: number }[];
};

export type Scene = {
  id: string;
  place: string;
  time: string;
  title: string;
  image: string;
  core?: boolean;
  dialogue: { who: string; line: string }[];
  question: string;
  hint: string;
  choices: Choice[];
};

export type Member = {
  name: string;
  gender: Gender;
  where: string;
  top: string;
  left: string;
};

export const members: Member[] = [
  { name: "林一", gender: "m", where: "在客厅", top: "22%", left: "6%" },
  { name: "周叙", gender: "m", where: "在厨房", top: "22%", left: "56%" },
  { name: "沈知", gender: "m", where: "在阳台", top: "33%", left: "30%" },
  { name: "陆野", gender: "m", where: "在客厅", top: "44%", left: "6%" },
  { name: "江郁", gender: "m", where: "在阳台", top: "44%", left: "56%" },
  { name: "苏杳", gender: "f", where: "在客厅", top: "55%", left: "6%" },
  { name: "温宁", gender: "f", where: "在厨房", top: "55%", left: "56%" },
  { name: "许佳", gender: "f", where: "在阳台", top: "66%", left: "30%" },
  { name: "白露", gender: "f", where: "在厨房", top: "77%", left: "6%" },
  { name: "夏可", gender: "f", where: "在客厅", top: "77%", left: "56%" },
];

export const genderOf = (name: string): Gender =>
  members.find((m) => m.name === name)?.gender ?? "m";

export const scenes: Scene[] = [
  {
    id: "kitchen",
    place: "厨房",
    time: "21:13",
    title: "厨房里的十二分钟",
    image: kitchen,
    core: true,
    dialogue: [
      { who: "林一", line: "你是不是有话想跟我说？" },
      { who: "温宁", line: "……我也不知道该怎么说。" },
      { who: "林一", line: "那就先别说，站一会儿也行。" },
    ],
    question: "你觉得温宁为什么这么回避？",
    hint: "你的选择会影响后续剧情发展",
    choices: [
      {
        key: "A",
        label: "她在试探林一的态度",
        result: "温宁停顿了一下，把碗放回水槽：「那你先说，你怎么想。」空气忽然变得很轻。",
        effects: [
          { name: "林一 × 温宁 心动值", delta: 6 },
          { name: "紧张感", delta: 3 },
        ],
      },
      {
        key: "B",
        label: "她真的还没想清楚",
        result: "温宁笑了笑，转身去擦台面：「等我想明白了，第一个告诉你。」林一没有追问。",
        effects: [
          { name: "林一 × 温宁 心动值", delta: 2 },
          { name: "信任度", delta: 5 },
        ],
      },
      {
        key: "C",
        label: "她不想告诉林一",
        result: "温宁沉默了整整十二秒，然后说了句「没事」。厨房的灯忽然显得太亮了。",
        effects: [
          { name: "林一 × 温宁 心动值", delta: -3 },
          { name: "悬念值", delta: 8 },
        ],
      },
    ],
  },
  {
    id: "living",
    place: "客厅",
    time: "20:37",
    title: "沙发上的第一次分组",
    image: living,
    dialogue: [
      { who: "苏杳", line: "明天的约会，要不要抽签决定？" },
      { who: "沈知", line: "抽签多没意思，自己选吧。" },
      { who: "夏可", line: "那就看谁先开口咯。" },
    ],
    question: "你希望今晚的分组怎么决定？",
    hint: "会影响明天的约会名单",
    choices: [
      {
        key: "A",
        label: "抽签，交给运气",
        result: "签抽出来的一刻，陆野明显松了口气，白露却低下了头。",
        effects: [{ name: "意外度", delta: 7 }],
      },
      {
        key: "B",
        label: "各自邀请，公开表态",
        result: "沈知第一个站起来，走向了阳台的方向。客厅安静了两秒。",
        effects: [
          { name: "沈知 × 许佳 心动值", delta: 5 },
          { name: "紧张感", delta: 4 },
        ],
      },
      {
        key: "C",
        label: "今晚先不定，明早再说",
        result: "话题被轻轻放下，但每个人都记住了刚才谁看了谁一眼。",
        effects: [{ name: "悬念值", delta: 4 }],
      },
    ],
  },
  {
    id: "balcony",
    place: "阳台",
    time: "22:40",
    title: "阳台上的那支烟火",
    image: balcony,
    dialogue: [
      { who: "沈知", line: "你今天在厨房，是不是有点奇怪？" },
      { who: "温宁", line: "被你看出来了。" },
    ],
    question: "要不要让沈知把这件事说出去？",
    hint: "秘密的流向决定关系的走向",
    choices: [
      {
        key: "A",
        label: "让沈知替温宁保密",
        result: "沈知点了点头：「那这事就烂在阳台上。」两个人的关系近了一步。",
        effects: [
          { name: "温宁 × 沈知 信任度", delta: 8 },
          { name: "林一的信息差", delta: 5 },
        ],
      },
      {
        key: "B",
        label: "让沈知去提醒林一",
        result: "第二天早餐桌上，林一看向温宁的眼神变了。",
        effects: [
          { name: "林一 × 温宁 心动值", delta: 4 },
          { name: "温宁 × 沈知 信任度", delta: -6 },
        ],
      },
      {
        key: "C",
        label: "什么都不做",
        result: "夜风把话吹散了。有些事，明天会自己发生。",
        effects: [{ name: "悬念值", delta: 6 }],
      },
    ],
  },
];

export const dateCard = {
  title: "明日约会 · 城南旧书店",
  time: "Day 05 · 15:00",
  desc: "五男五女，两人一组，60 分钟独处。名单会在今晚的核心选择之后揭晓。",
};
