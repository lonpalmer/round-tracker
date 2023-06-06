export function log(message, ...args) {
  formatLog(console.log, message, ...args);
}

export function error(message, ...args) {
  formatLog(console.error, message, ...args);
}

export function warn(message, ...args) {
  formatLog(console.warn, message, ...args);
}

export function debug(message, ...args) {
  formatLog(console.debug, message, ...args);
}

export function trace(message, ...args) {
  formatLog(console.trace, message, ...args);
}

export function group(message, ...args) {
  formatLog(console.group, message, ...args);
}

export function groupCollapsed(message, ...args) {
  formatLog(console.groupCollapsed, message, ...args);
}

export function groupEnd() {
  console.groupEnd();
}

function formatLog(logMethod, message, ...args) {
  if (typeof message === "string") {
    message = `Round Tracker | ${message}`;
  } else {
    message = ["Round Tracker |", message];
  }

  logMethod(message, ...args);
}
