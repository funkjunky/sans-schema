export default (word => {
  const lastLetter = word.slice(-1);
  if (lastLetter === 'y') return word.slice(0, -1) + 'ies';else return word + 's';
});
export const singulize = word => {
  if (word.substr(-3) === 'ies') return word.slice(0, -3) + 'y';else return word.slice(0, -1);
};