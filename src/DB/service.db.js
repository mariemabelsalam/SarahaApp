export const findOne = ({ model = "", filter = {} } = {}) => {
  return model.findOne(filter);
};
export const updateOne = ({
  model = "",
  filter = {},
  data = {},
  option = { runValidator: true },
} = {}) => {
  return model.updateOne(filter, data, option);
};

export const findById = ({ model = "", filter } = {}) => {
  return model.findById(filter);
};

export const create = ({ model = "", data = [{}] } = {}) => {
  return model.create(data);
};

export const findOneAndUpdate = ({
  model = "",
  filter = {},
  data = {},
  option = { runValidators: true, new: true },
  populate = [],
  select = "",
} = {}) => {
  return model
    .findOneAndUpdate(
      filter,
      {
        $set:data,
        $inc: { __v: 1 },
      },
      option
    )
    .select(select)
    .populate(populate);
};



export const deleteOne = ( {model,filter}={} )=>{
  return model.deleteOne(filter)
}