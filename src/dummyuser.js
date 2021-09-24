const users = []

// joins the user to the specific chatroom
function join_User(id, username, room) {
  const user = { id, username, room }

  users.push(user)

  return user
}

// Gets a particular user id to return the current user
function get_Current_User(id) {
  return users.find((p_user) => p_user.id === id)
}

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) {
  const index = users.findIndex((p_user) => p_user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
}
