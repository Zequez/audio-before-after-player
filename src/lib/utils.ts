export const sizeInBToMb = (size: number) => {
  return Math.round((size / 1024 / 1024) * 100) / 100;
};

export const timeInSecondsToMinutesSeconds = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time - minutes * 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const extractNameFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};
