import { createService, findAllService } from "../services/news.service.js";

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
      user: { _id: "64163214807c787f1e55aedf" },
    });

    res.status(201).send("criado").end();
  } catch (err) {
    res.status(500).send({ message: err }).end();
  }
};

const findAll = async (req, res) => {
  try {
    const news = await findAllService();

    if (news.length === 0) {
      return res.status(400).send({ message: "There are no registered news" });
    }

    res.status(200).send(news).end();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export { create, findAll };
