const form = document.getElementById("chat-form")
const chatMessage = document.querySelector(".chat-messages")
const RoomName = document.getElementById('room-name')
const UserName = document.getElementById('users')
const socket = io()

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
})
socket.emit('joinroom', {username, room})
socket.on('roomUsers', ({users, room } ) => {
    OutputRoomName(room);
    OutputUsers(users)
})
socket.on('message', message => {
    console.log(message)
    outputMessage(message)
    chatMessage.scrollTop = chatMessage.scrollHeight
})
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg)
    e.target.elements.msg.value = '';
    e.target.msg.focus()
})
function outputMessage(message) 
{
   const div = document.createElement('div')
   div.classList.add('message')
   div.innerHTML = `
   <p class="meta">${message.username} <span>${message.time}</span></p>
   <p class="text">
            ${message.text}
   </p>
   `
   document.querySelector('.chat-messages').appendChild(div)
}
function OutputRoomName(room) 
{
    RoomName.innerText = room
}
function OutputUsers(users)
{
    UserName.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}   
    `
}