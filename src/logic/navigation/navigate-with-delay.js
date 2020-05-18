import { navigate } from "hookrouter";

const WAIT_DELAY = 100;

export const navigateWithDelay = (...args) => {
    setTimeout(() => navigate(...args), WAIT_DELAY);
}

export const navigateWithCustomDelay = (delay, ...args) => {
    setTimeout(() => navigate(...args), delay);
};