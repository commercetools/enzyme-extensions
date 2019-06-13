module.exports = {
  '*.js': ['yarn lint'],
  '*.md': ['yarn format:md', 'git add'],
};
