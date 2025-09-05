
const COOLDOWN_PERIOD = 30 * 1000; // 30 seconds
const STORAGE_KEY = 'auth_rate_limit';

interface RateLimitData {
  [action: string]: number; // action -> timestamp of last failed attempt
}

const getRateLimitData = (): RateLimitData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Could not read rate limit data from localStorage", e);
    return {};
  }
};

const setRateLimitData = (data: RateLimitData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save rate limit data to localStorage", e);
  }
};

/**
 * Records a failed authentication attempt for a specific action.
 * @param action - A unique identifier for the action (e.g., 'login', 'signup').
 */
export const recordAuthAttempt = (action: string) => {
  const data = getRateLimitData();
  data[action] = Date.now();
  setRateLimitData(data);
};

/**
 * Checks if a specific action is currently rate-limited.
 * @param action - A unique identifier for the action.
 * @returns An object with `isLimited` (boolean) and `timeLeft` (number in seconds).
 */
export const checkRateLimit = (action: string): { isLimited: boolean; timeLeft: number } => {
  const data = getRateLimitData();
  const lastAttemptTime = data[action];

  if (!lastAttemptTime) {
    return { isLimited: false, timeLeft: 0 };
  }

  const timePassed = Date.now() - lastAttemptTime;

  if (timePassed < COOLDOWN_PERIOD) {
    const timeLeft = Math.ceil((COOLDOWN_PERIOD - timePassed) / 1000);
    return { isLimited: true, timeLeft };
  }

  return { isLimited: false, timeLeft: 0 };
};
