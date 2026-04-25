const Item = require("../models/Item");
const matchItems = require("../utils/matcher");
console.log("matchItems type:", typeof matchItems); // 👈 debug line

// ➕ Add Item
exports.addItem = async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      user: req.user
    });

    await newItem.save();

    const allItems = await Item.find({
      community: newItem.community
    });

    const matches = matchItems(newItem, allItems);

    const io = req.app.get("io");
    io.emit("newItem", newItem);
    io.emit("matchFound", matches);

    res.status(201).json({
      success: true,
      item: newItem,
      matches
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📥 Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get by community
exports.getByCommunity = async (req, res) => {
  try {
    const items = await Item.find({
      community: req.params.community
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔄 Update item status (ONLY OWNER)
exports.updateStatus = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item.user.toString() !== req.user) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    const io = req.app.get("io");
    io.emit("statusUpdated", updated);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete item (ONLY OWNER)
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item.user.toString() !== req.user) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    await Item.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");
    io.emit("itemDeleted", req.params.id);

    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};