export const upToDownFn = (duration: number, delay: number) => ({
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  transition: {
    ease: ["linear"],
    duration,
    delay,
  },
});
