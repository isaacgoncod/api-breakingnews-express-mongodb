import userService from "../services/user.service.js";

const create = async (req, res) => {
  try {
    const { name, username, email, password, avatar, background } = req.body;

    if (!name || !username || !email || !password || !avatar || !background) {
      res
        .status(400)
        .json({ message: "Submit all fields for registration" })
        .end();
    }

    const user = await userService.createService(req.body);

    if (!user) {
      return res.status(400).send({ message: "Error creating User" });
    }

    res
      .status(201)
      .send({
        message: "User created successfully",
        user: {
          name: name,
          username: username,
          email: email,
          avatar: avatar,
          background: background,
        },
      })
      .end();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findAll = async (req, res) => {
  try {
    const users = await userService.findAllService();

    if (users.length === 0) {
      return res.status(400).send({ message: "There are no registered user" });
    }

    res.status(200).send(users).end();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findById = async (req, res) => {
  try {
    const { user } = req;
    // const id = req.params.id;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).send({ message: "Invalid ID" });
    // }

    // const user = await userService.findByIdService(id);

    // if (!user) {
    //   res.status(400).send({ message: "User not found" });
    // }

    res.status(200).send(user).end();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { name, username, email, password, avatar, background } = req.body;
    const { id, user } = req;

    if (!name && !username && !email && !password && !avatar && !background) {
      res
        .status(400)
        .json({ message: "Submit all least one field for update" })
        .end();
    }

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).send({ message: "Invalid ID" });
    // }

    // const user = await userService.findByIdService(id);

    // if (!user) {
    //   return res.status(400).send({ message: "Error creating User" });
    // }

    await userService.updateService(
      id,
      name,
      username,
      email,
      avatar,
      background
    );

    res.status(202).send({ message: "User successfully updated" }).end();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export default {
  create,
  findAll,
  findById,
  update,
};
