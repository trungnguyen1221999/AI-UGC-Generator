const spacingSteps = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24] as const;

const mtClassByValue: Record<number, string> = {
  [-24]: "-mt-24",
  [-20]: "-mt-20",
  [-16]: "-mt-16",
  [-14]: "-mt-14",
  [-12]: "-mt-12",
  [-10]: "-mt-10",
  [-8]: "-mt-8",
  [-6]: "-mt-6",
  [-5]: "-mt-5",
  [-4]: "-mt-4",
  [-3]: "-mt-3",
  [-2]: "-mt-2",
  [-1]: "-mt-1",
  0: "mt-0",
  1: "mt-1",
  2: "mt-2",
  3: "mt-3",
  4: "mt-4",
  5: "mt-5",
  6: "mt-6",
  8: "mt-8",
  10: "mt-10",
  12: "mt-12",
  14: "mt-14",
  16: "mt-16",
  20: "mt-20",
  24: "mt-24",
};

const mdMtClassByValue: Record<number, string> = {
  [-24]: "md:-mt-24",
  [-20]: "md:-mt-20",
  [-16]: "md:-mt-16",
  [-14]: "md:-mt-14",
  [-12]: "md:-mt-12",
  [-10]: "md:-mt-10",
  [-8]: "md:-mt-8",
  [-6]: "md:-mt-6",
  [-5]: "md:-mt-5",
  [-4]: "md:-mt-4",
  [-3]: "md:-mt-3",
  [-2]: "md:-mt-2",
  [-1]: "md:-mt-1",
  0: "md:mt-0",
  1: "md:mt-1",
  2: "md:mt-2",
  3: "md:mt-3",
  4: "md:mt-4",
  5: "md:mt-5",
  6: "md:mt-6",
  8: "md:mt-8",
  10: "md:mt-10",
  12: "md:mt-12",
  14: "md:mt-14",
  16: "md:mt-16",
  20: "md:mt-20",
  24: "md:mt-24",
};

const mobilePattern = [0, 2, 1, 0, 0];
const desktopPattern = [2, 5, -2, 4, 2];

const snapSpacing = (value: number) => {
  if (value === 0) return 0;

  const sign = value < 0 ? -1 : 1;
  const absValue = Math.min(Math.abs(value), 24);
  const nearest = spacingSteps.reduce((prev, curr) => {
    return Math.abs(curr - absValue) < Math.abs(prev - absValue) ? curr : prev;
  }, spacingSteps[0]);

  return sign * nearest;
};

const getMarginTopClass = (value: number, isDesktop = false) => {
  const snapped = snapSpacing(value);
  return isDesktop ? mdMtClassByValue[snapped] : mtClassByValue[snapped];
};

export const getVideoStaggerClass = (index: number, level: number) => {
  const normalizedLevel = Math.max(0, level);
  const mobileOffset = (mobilePattern[index] ?? 0) * normalizedLevel;
  const desktopOffset = (desktopPattern[index] ?? 0) * normalizedLevel;

  return `${getMarginTopClass(mobileOffset)} ${getMarginTopClass(desktopOffset, true)}`;
};
