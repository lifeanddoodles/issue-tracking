export const getClasses = (level: number) => {
  switch (level) {
    case 1:
      return "text-3xl xl:text-4xl";
    case 3:
      return "text-xl";
    case 4:
      return "text-lg";
    case 2:
    default:
      return "text-2xl";
  }
};
