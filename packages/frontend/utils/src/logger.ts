const getRandomColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
};
export const createLogger = (componentName: string) =>
  import.meta.env.DEV ? console.info.bind(null, `%c${componentName}:`, `color: ${getRandomColor()};`) : () => null;
