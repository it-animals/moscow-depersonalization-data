export const upToDownAnimate = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  transition: {
    ease: ["easeInOut"],
    duration: 0.3,
    delay: 0.55,
  },
};

export const upToDownFn = (duration: number, delay: number) => ({
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  transition: {
    ease: ["easeInOut"],
    duration,
    delay,
  },
});
