const Item = require("../models/Item");
const matchItems = require("../utils/matcher");

exports.addItem = async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      user: req.user
    });

    await newItem.save();

    const allItems = await Item.find({ community: newItem.community });
    const matches = matchItems(newItem, allItems);

    const io = req.app.get("io");
    const userSockets = req.app.get("userSockets");

    if (matches.length > 0) {
      matches.forEach((match) => {
        const socketId = userSockets[match.user.toString()];
        if (socketId) {
          io.to(socketId).emit("matchFound", {
            message: `🎉 Someone found your "${match.title}"!`,
            foundItem: newItem,
            lostItem: match,
          });
        }
      });
    }

    io.emit("newItem", newItem);

    res.status(201).json({
      success: true,
      item: newItem,
      matches
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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