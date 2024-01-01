const MODS = {
  0: "None",
  1: "NoFail",
  2: "Easy",
  4: "TouchDevice",
  8: "Hidden",
  16: "HardRock",
  32: "SuddenDeath",
  64: "DoubleTime",
  128: "Relax",
  256: "HalfTime",
  512: "Nightcore",
  1024: "Flashlight",
  2048: "Autoplay",
  4096: "SpunOut",
  8192: "Relax2",
  16384: "Perfect",
  32768: "Key4",
  65536: "Key5",
  131072: "Key6",
  262144: "Key7",
  524288: "Key8",
  1048576: "FadeIn",
  2097152: "Random",
  4194304: "Cinema",
  8388608: "Target",
  16777216: "Key9",
  33554432: "KeyCoop",
  67108864: "Key1",
  134217728: "Key3",
  268435456: "Key2",
  536870912: "ScoreV2",
  1073741824: "Mirror",
};

type Mod = keyof typeof MODS;
type ModName = (typeof MODS)[Mod];

export function getModsFromBitwise(mods: number) {
  const modList: ModName[] = [];
  Object.entries(MODS).forEach(([key, value]) => {
    const mod = Number(key) as Mod;
    if (mods & mod) {
      modList.push(value);
    }
  });
  return modList;
}
