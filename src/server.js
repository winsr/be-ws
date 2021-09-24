const express = require("express")
const app = express()
const socket = require("socket.io")
const cors = require("cors")
const { get_Current_User, user_Disconnect, join_User } = require("./dummyuser")

app.use(express())
app.use(cors())

const port = 8000
const server = app.listen(
  port,
  console.log(`Server is running on the port no: ${port}`)
)
const io = socket(server)

//initializing the socket io connection
io.on("connection", (socket) => {
  //for a new user joining the room
  socket.on("joinRoom", ({ username, roomname }) => {
    const user = join_User(socket.id, username, roomname)
    socket.join(user.room)

    //display a welcome message to the user who have joined a room
    socket.emit("message", {
      userId: user.id,
      username: user.username,
      text: `Welcome ${user.username}`,
    })

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(user.room).emit("message", {
      userId: user.id,
      username: user.username,
      text: `${user.username} has joined the chat`,
    })
  })

  //user sending message
  socket.on("chat", (text) => {
    //gets the room user and the message sent
    const user = get_Current_User(socket.id)

    io.to(user.room).emit("message", {
      userId: user.id,
      username: user.username,
      text: text,
    })
  })

  //when the user exits the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const user = user_Disconnect(socket.id)

    if (user) {
      io.to(user.room).emit("message", {
        userId: user.id,
        username: user.username,
        text: `${user.username} has left the room`,
      })
    }
  })
})
