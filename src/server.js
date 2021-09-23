const express = require("express")
const app = express()
const socket = require("socket.io")
const color = require("colors")
const cors = require("cors")

const { joinUser, findUserById, userDisconnect } = require("./dummyuser")

app.use(express())
app.use(cors())

const port = 8000
const server = app.listen(
  port,
  console.log(`Server is running on the port no: ${port} `.green)
)

const io = socket(server)
io.on("connection", (socket) => {
  // for a new user joining the room
  socket.on("joinRoom", ({ username, roomname }) => {
    // create new user
    const user = {
      id: socket.id,
      room: roomname,
      username,
    }
    joinUser(user)

    // ! display welcome message to all users
    socket.emit("message", {
      userId: user.id,
      username: username,
      text: `Welcome ${username}`,
    })

    // ! display message to tell all users in the room, that new user is joined
    socket.broadcast.to(user.room).emit("message", {
      userId: user.id,
      username: username,
      text: `${username} has joined the chat`,
    })
  })

  // user send message
  socket.on("chat", (text) => {
    //gets the room user and the message sent
    const { room, id, username } = findUserById(socket.id)

    io.to(room).emit("message", {
      userId: id,
      username: username,
      text: text,
    })
  })

  // when the user exits the room
  socket.on("disconnect", () => {
    const user = userDisconnect(socket.id)

    if (user) {
      const { room, id, username } = user
      io.to(room).emit("message", {
        userId: id,
        username: username,
        text: `${username} has left the room`,
      })
    }
  })
})
