function matchItems(newItem, items) {
  return items.filter(item => {
    try {
      return (
        item.type !== newItem.type &&
        item.community === newItem.community &&
        (item.title || "").toLowerCase().includes((newItem.title || "").toLowerCase()) &&
        (item.location || "").toLowerCase().includes((newItem.location || "").toLowerCase())
      );
    } catch (e) {
      return false;
    }
  });
}

module.exports = matchItems;