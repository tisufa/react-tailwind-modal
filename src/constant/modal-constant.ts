export const PREFIX = "sentuh-tailwind-modal";

export const sizeMap: Record<string, string> = {
  xs: `${PREFIX}-size-xs`,
  sm: `${PREFIX}-size-sm`,
  md: `${PREFIX}-size-md`,
  lg: `${PREFIX}-size-lg`,
  xl: `${PREFIX}-size-xl`,
  "2xl": `${PREFIX}-size-2xl`,
  "3xl": `${PREFIX}-size-3xl`,
  "4xl": `${PREFIX}-size-4xl`,
  "5xl": `${PREFIX}-size-5xl`,
  "6xl": `${PREFIX}-size-6xl`,
  "7xl": `${PREFIX}-size-7xl`,
  full: `${PREFIX}-size-full`,
  screen: `${PREFIX}-screen`,
};

export const cls = (name: string) => `${PREFIX}-${name}`;
