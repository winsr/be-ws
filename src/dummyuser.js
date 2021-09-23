const users = []

const joinUser = ({ id, username, room }) => {
  const newUser = { id, username, room }
  users.push(newUser)
  console.log("new users => ", newUser)

  return newUser
}

const findUserById = ({ id }) => users.find((user) => user.id === id)

function userDisconnect({ id }) {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) user.splice(index, 1)[0]
}

module.exports = {
  joinUser,
  findUserById,
  userDisconnect,
}
