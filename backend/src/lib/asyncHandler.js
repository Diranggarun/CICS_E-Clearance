// Wraps an async route handler so a rejected promise (e.g. a transient DB
// error) is forwarded to Express's error middleware instead of crashing the
// process with an unhandled rejection.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
