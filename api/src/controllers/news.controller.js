import {
  createService,
  findAllService,
  countNews,
  topNewsService,
  findByIdService,
  searchByTitleService,
  byUserService,
  updateService,
  eraseService,
  likeNewsService,
  deleteLikeNewsService,
  addCommentService,
  deleteCommentService,
} from "../services/news.service.js";

const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;

    if (!title || !text || !banner) {
      res
        .status(400)
        .send({ message: "Submit all fields for registration" })
        .end();
    }

    await createService({
      title,
      text,
      banner,
      user: req.userId,
    });

    res.status(201).send("criado").end();
  } catch (err) {
    res.status(500).send({ message: err }).end();
  }
};

const findAll = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
      limit = 5;
    }

    if (!offset) {
      offset = 0;
    }

    const news = await findAllService(offset, limit);

    const total = await countNews();

    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previus = offset - limit < 0 ? null : offset - limit;
    const previusUrl =
      previus != null ? `${currentUrl}?limit=${limit}&offset=${previus}` : null;

    if (news.length === 0) {
      return res.status(400).send({ message: "There are no registered news" });
    }

    res
      .status(200)
      .send({
        nextUrl,
        previusUrl,
        limit,
        offset,
        total,

        results: news.map((item) => ({
          id: item.id,
          title: item.title,
          text: item.text,
          banner: item.banner,
          likes: item.likes,
          comments: item.comments,
          name: item.user.name,
          userName: item.user.username,
          userAvatar: item.user.avatar,
        })),
      })
      .end();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const topNews = async (req, res) => {
  try {
    const news = await topNewsService();

    if (!news) {
      return res.status(400).send({ message: "There is no registered post" });
    }

    res.send({
      news: {
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        userName: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err }).end();
  }
};

const findById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await findByIdService(id);

    res
      .status(200)
      .send({
        news: {
          title: news.title,
          text: news.text,
          banner: news.banner,
          likes: news.likes,
          comments: news.comments,
          name: news.user.name,
          userName: news.user.username,
          userAvatar: news.user.avatar,
        },
      })
      .end();
  } catch (err) {
    res.status(500).send({ message: err }).end();
  }
};

const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    const news = await searchByTitleService(title);

    if (news.length === 0) {
      return res
        .status(400)
        .send({ message: "There are no news with this title" });
    }

    res
      .status(200)
      .send({
        news: news.map((item) => ({
          id: item.id,
          title: item.title,
          text: item.text,
          banner: item.banner,
          likes: item.likes,
          comments: item.comments,
          name: item.user.name,
          userName: item.user.username,
          userAvatar: item.user.avatar,
        })),
      })
      .end();
  } catch (err) {
    res.status(500).send({ message: err }).end();
  }
};

const byUser = async (req, res) => {
  try {
    const id = req.userId;

    const news = await byUserService(id);

    res
      .status(200)
      .send({
        news: news.map((item) => ({
          id: item.id,
          title: item.title,
          text: item.text,
          banner: item.banner,
          likes: item.likes,
          comments: item.comments,
          name: item.user.name,
          userName: item.user.username,
          userAvatar: item.user.avatar,
        })),
      })
      .end();
  } catch (err) {
    res.status(500).send({ message: err }).end();
  }
};

const update = async (req, res) => {
  try {
    const { title, text, banner } = req.body;
    const { id } = req.params;

    if (!title && !banner && !text) {
      res
        .status(400)
        .send({ message: "Submit at least one field to update the post" })
        .end();
    }

    const news = await findByIdService(id);

    if (String(news.user._id) !== req.userId) {
      return res.status(400).send({
        message: "You didn't update this post",
      });
    }

    await updateService(id, title, text, banner);

    return res.status(202).send({ message: "Post successfully updated" });
  } catch (err) {
    res.status(500).send({ message: err }).end();
  }
};

const erase = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await findByIdService(id);

    if (String(news.user._id) !== req.userId) {
      return res.status(400).send({
        message: "You didn't delete this post",
      });
    }

    await eraseService(id);

    return res.status(202).send({ message: "News deleted succesfully" });
  } catch (err) {
    res.status(500).send({ message: err }).end();
  }
};

const likeNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const newsLiked = await likeNewsService(id, userId);
    console.log(newsLiked);

    if (!newsLiked) {
      await deleteLikeNewsService(id, userId);
      return res.status(200).send({ message: "Like removed" });
    }
    res.status(202).send({ message: "Like done" }).end();
  } catch (err) {
    res.status(500).send({ message: err.message }).end();
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment } = req.body;

    if (!comment) {
      res.status(400).send({ message: "Write a message to comment" }).end();
    }

    await addCommentService(id, comment, userId);

    res.status(202).send({ message: "Comment successfully completed" }).end();
  } catch (err) {
    res.status(500).send({ message: err.message }).end();
  }
};

const deleteComment = async (req, res) => {
  try {
    const { idNews, idComment } = req.params;
    const userId = req.userId;

    const commentDeleted = await deleteCommentService(
      idNews,
      idComment,
      userId
    );

    const commentFinder = commentDeleted.comments.find(
      (comment) => comment.idComment === idComment
    );

    if (commentFinder.userId !== userId) {
      res.status(400).send({ message: "You can't delete this comment" }).end();
    }

    res.status(202).send({ message: "Comment successfully deleted" }).end();
  } catch (err) {
    res.status(500).send({ message: err.message }).end();
  }
};

export {
  create,
  findAll,
  topNews,
  findById,
  searchByTitle,
  byUser,
  update,
  erase,
  likeNews,
  addComment,
  deleteComment,
};
