export const uploadFileAnimate = {
  notFiles: {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 },
    transition: {
      ease: ["easeInOut"],
      duration: 0,
      delay: 0,
    },
  },
  haveFiles: {
    initial: { height: 540 },
    animate: { height: 120 },
    transition: {
      ease: ["easeInOut"],
      duration: 0.3,
      delay: 0.2,
    },
  },
};
