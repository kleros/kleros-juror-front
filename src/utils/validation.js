export const required = name => v =>
  v !== null && v !== undefined ? undefined : `${name} is required.`
export const number = name => v =>
  Number.isNaN(Number(v)) ? `${name} must be a number.` : undefined
export const positiveNumber = name => v =>
  v < 0 ? `${name} must be positive.` : undefined
