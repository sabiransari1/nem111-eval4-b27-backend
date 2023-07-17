const express = require("express");
const postRoutes = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const postModel = require("../models/postModel");

postRoutes.use(authMiddleware);

postRoutes.get("/posts", async (req, res) => {
  try {
    const existingUserID = req.body.userID;

    const posts = await postModel.find({ userID: existingUserID });
    return res.status(200).send(posts);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

postRoutes.post("/addposts", async (req, res) => {
  try {
    const existingUserID = req.body.userID;

    const post = await postModel.create({
      ...req.body,
      userID: existingUserID,
    });

    post.populate();
    return res
      .status(200)
      .send({ msg: "Post has been added successfully", post });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

postRoutes.patch("/update/:postID", async (req, res) => {
  try {
    const existingUserID = req.body.userID;
    const postID = req.params.postID;

    const post = await postModel.findById(postID);

    if (post.userID.toString() == existingUserID) {
      const updatedPost = await postModel.findByIdAndUpdate(postID, req.body, {
        new: true,
      });
      return res
        .status(200)
        .send({ msg: "Post has been updated successfully", updatedPost });
    } else {
      return res.status(400).send({ msg: "Invaild user ID" });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

postRoutes.delete("/delete/:postID", async (req, res) => {
  try {
    const existingUserID = req.body.userID;
    const postID = req.params.postID;

    const post = await postModel.findById(postID);

    if (post.userID.toString() == existingUserID) {
      const deletedPost = await postModel.findByIdAndDelete(postID);
      return res
        .status(200)
        .send({ msg: "Post has been deleted successfully", deletedPost });
    } else {
      return res.status(400).send({ msg: "Invaild user ID" });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

module.exports = postRoutes;
