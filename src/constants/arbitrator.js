export const PERIOD_ENUM = [
  'deposit', // When juror can activate their tokens and parties give evidences
  'draw', // When jurors are drawn at random, note that this period is fast
  'vote', // Where jurors can vote on disputes
  'appeal', // When parties can appeal the rulings
  'execution' // When where token redistribution occurs and Kleros call the arbitrated contracts
]
export const PERIOD_DESCRIPTION_ENUM = [
  'You can deposit PNK to be drawn as a juror.',
  'Users are being drawn as jurors.',
  'You can vote on the cases for which you were drawn.',
  'Parties can appeal rulings.',
  'PNK is being distributed and rulings are being executed.'
]
