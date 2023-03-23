import User from "../models/User.js";

const createService = (body) => {
  return User.create(body);
};

const findAllService = () => User.find();

const findByIdService = (id) => User.findById(id);

const updateService = (id, name, username, email, avatar, background) =>
  User.findOneAndUpdate(
    { _id: id },
    { name, username, email, avatar, background }
  );

export default{
  createService,
  findAllService,
  findByIdService,
  updateService,
};
