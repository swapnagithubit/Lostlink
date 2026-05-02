function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function wordsMatch(str1, str2) {
  const s1 = (str1 || "").toLowerCase().replace(/[_\-]/g, " ").trim();
  const s2 = (str2 || "").toLowerCase().replace(/[_\-]/g, " ").trim();

  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);

  const commonWords = words1.filter(word =>
    words2.some(w => {
      if (w === word) return true;
      if (w.includes(word) || word.includes(w)) return true;
      return levenshtein(w, word) <= 2;
    })
  );

  return commonWords.length > 0;
}

function matchItems(newItem, items) {
  return items.filter(item => {
    try {
      return (
        item.type !== newItem.type &&
        item.community === newItem.community &&
        wordsMatch(item.title, newItem.title)
      );
    } catch (e) {
      return false;
    }
  });
}

module.exports = matchItems;