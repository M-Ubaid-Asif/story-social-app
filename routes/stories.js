const storyRouter = require("express").Router();

const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/storyModel");

// show add page
// rout GET /Stories/add
storyRouter.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

storyRouter.post("/", ensureAuth, async (req, res) => {
  try {
    // console.log(req.body);
    req.body.user = req.user._id;
    const story = await Story.create(req.body);
    res.redirect("dashboard");
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

// show all stories
// route GET /
storyRouter.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", {
      stories,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
});

// rout GET /Stories/add
storyRouter.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (error) {
    res.render("error/500");
  }
});

// show edit page
// route GET /stories/edit/:id
storyRouter.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const story = await Story.findById(_id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user.toString() !== req.user._id.toString()) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", { story });
    }
  } catch (error) {
    return res.render("error/500");
  }
});

// show single story
// route Get /stories/:id
storyRouter.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      res.render("error/404");
    }

    res.render("stories/show", {
      story,
    });
  } catch (error) {
    res.render("error/404");
  }
});

storyRouter.put("/:id", async (req, res) => {
  let story = await Story.findById(req.params.id);

  if (!story) {
    res.render("error/404");
  }

  if (story.user.toString() !== req.user._id.toString()) {
    // console.log("asd");
    return res.redirect("/stories");
  } else {
    story = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.redirect("/dashboard");
  }
});

storyRouter.delete("/:id", ensureAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    await Story.findByIdAndDelete(_id);
    res.redirect("/dashboard");
  } catch (error) {
    res.render("error/500");
  }
});
module.exports = storyRouter;
