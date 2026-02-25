import type { Transition, Variants } from "framer-motion";

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.56,
      ease: [0.22, 1, 0.36, 1]
    } as Transition
  }
};

export const sectionRevealReduced: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.22,
      ease: "easeOut"
    } as Transition
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08
    }
  }
};

export const staggerContainerReduced: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.02
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.44,
      ease: [0.22, 1, 0.36, 1]
    } as Transition
  }
};

export const staggerItemReduced: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    } as Transition
  }
};

export const cardLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -6,
    scale: 1.008,
    transition: {
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1]
    } as Transition
  }
};

export const cardLiftReduced = {
  rest: { opacity: 1 },
  hover: {
    opacity: 0.98,
    transition: {
      duration: 0.12,
      ease: "easeOut"
    } as Transition
  }
};

export const buttonLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -2,
    scale: 1.01,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1]
    } as Transition
  },
  tap: {
    y: 0,
    scale: 0.99,
    transition: {
      duration: 0.12,
      ease: "easeOut"
    } as Transition
  }
};

export const buttonLiftReduced = {
  rest: { opacity: 1 },
  hover: {
    opacity: 0.96,
    transition: { duration: 0.12, ease: "easeOut" } as Transition
  },
  tap: {
    opacity: 0.9,
    transition: { duration: 0.1, ease: "easeOut" } as Transition
  }
};
