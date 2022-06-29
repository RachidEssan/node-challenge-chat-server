const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];
let availableId = messages.length

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

// display messages

app.get("/messages", function (request, response) {
  response.send(messages);
});

// display messages by id

app.get("/messages/:id", function (request, response) {
  let messageId = request.params.id;
  response.send(messages[messageId]);
});

// add new message

app.post("/messages", function(request, response){
  const {from, text} = request.body;
  if (from.length <= 3 && text.length < 1) {
    response.status(400).send("Please write a name and message");
  } else if (text.length < 1) {
    response.status(400).send("Please write a message");
  } else if (from.length <= 3) {
    response.status(400).send("Please write a name of at least 3 characters");
  } else {
    const newMessage = {
      id: availableId++,
      from: from,
      text: text,
    };
    messages.push(newMessage);
    response.status(201).send("Your message has been sent!");
  }
});

// delete message

app.delete("/messages/:id", function(request, response){
  let messageId = request.params.id;
  const selectedMessage = messages.find(message => message.id == messageId);
  if (selectedMessage) {
    messages.splice(selectedMessage, 1)
    response.status(200).send("Message deleted");
  } else {
    response.status(404).send("Message not found");
  }
});

app.listen(3000, () => {console.log("Listening on port 3000")});
