export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

import { LOG_LEVELS, APP_NAMES } from './constants.js';

export function getRandomLevel() {
  return LOG_LEVELS[getRandomInt(0, LOG_LEVELS.length - 1)];
}

export function getRandomAppName() {
  return APP_NAMES[getRandomInt(0, APP_NAMES.length - 1)];
}

export function getRandomDetails(level) {
  switch (level) {
    case "info":
      return { message: "Operation completed successfully", code: 200 };
    case "error":
      return { message: "An error occurred", code: 500, stack: "Error: ..." };
    case "warn":
      return { message: "Potential issue detected", code: 300 };
    case "debug":
      return { message: "Debugging info", variable: "x", value: getRandomInt(1, 100) };
    default:
      return { message: "Unknown log level" };
  }
} 