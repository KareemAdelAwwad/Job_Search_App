const baseURL = "https://job-search.kareemadel.com";
// const baseURL = "http://localhost:3000";

const token = `${localStorage.getItem("token")}`;

let globalProfile = {};
let userId = "";
// Common headers for all backend requests
const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "accesstoken": token
};

// Establish a connection to the server
const clintIo = io(baseURL, {
    auth: { accesstoken: token }
});

// Default images links
let avatar = "./avatar/Avatar-No-Background.png";
let meImage = "./avatar/Avatar-No-Background.png";
let friendImage = "./avatar/Avatar-No-Background.png";

// Send new message on the chat
function sendMessage(receiverId) {
    const data = {
        body: $("#messageBody").val(),
        receiverId,
    };
    console.log({ data });
    clintIo.emit("sendMessage", data);
}

// Receive new HR notification
clintIo.on("HRNotification", ({ message }) => {
    console.log(message);
    const toast = document.getElementById("toast");
    toast.classList.remove("hidden");
    toast.innerText = message;
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 5000);
});

// trigger when the server sends a message successfully
clintIo.on("successMessage", (data) => {
    const { chat, body } = data;
    meImage = chat?.senderId.image?.url || globalProfile?.profilePicture?.url || avatar;
    friendImage = chat?.receiverId.image?.url || avatar;

    const div = document.createElement("div");

    div.className = "me";
    div.innerHTML = `
        <img class="chatImage" src="${meImage}" alt="" srcset="">
        <span class="mx-2">${body}</span>
    `;
    document.getElementById("messageList").appendChild(div);
    $(".noResult").hide();
    $("#messageBody").val("");

    // Scroll to the latest message
    const messageList = document.getElementById("messageList");
    messageList.scrollTop = messageList.scrollHeight;
});

// Get the new message and sent it directly to the receiver
clintIo.on("receiveMessage", (data) => {
    const { body } = data;
    console.log("Receive message", body);

    const div = document.createElement("div");
    div.className = "myFriend";
    div.innerHTML = `
    <img class="chatImage" src="${friendImage}" alt="" srcset="">
    <span class="mx-2">${body}</span>
    `;
    document.getElementById("messageList").appendChild(div);

    // Scroll to the latest message
    const messageList = document.getElementById("messageList");
    messageList.scrollTop = messageList.scrollHeight;
});

// Success room message
clintIo.on("successRoomMessage", (data) => {
    const { chat, body } = data;
    meImage = globalProfile?.profilePicture?.url || avatar;
    const div = document.createElement("div");

    div.className = "me";
    div.innerHTML = `
        <img class="chatImage" src="${meImage}" alt="" srcset="">
        <span class="mx-2">${body}</span>
    `;
    document.getElementById("messageList").appendChild(div);
    $(".noResult").hide();
    $("#messageBody").val("");

    // Scroll to the latest message
    const messageList = document.getElementById("messageList");
    messageList.scrollTop = messageList.scrollHeight;
});

// Receive room message
clintIo.on("receiveRoomMessage", (data) => {
    const { body, sender } = data;
    const senderImg = sender?.profilePicture?.url || avatar;

    const div = document.createElement("div");
    div.className = "myFriend";
    div.innerHTML = `
    <img class="chatImage" src="${senderImg}" alt="" srcset="">
    <span class="mx-2">${body}</span>
    `;
    document.getElementById("messageList").appendChild(div);

    // Scroll to the latest message
    const messageList = document.getElementById("messageList");
    messageList.scrollTop = messageList.scrollHeight;
});

// Show the chathistory if there is any
function showData(destId, chat) {
    document.getElementById("sendMessage").setAttribute("onclick", `sendMessage('${destId}')`);

    // Hide leave button and show it's disabled
    const leaveButton = document.getElementById("leaveRoom");
    leaveButton.classList.add("opacity-50", "cursor-not-allowed");
    leaveButton.removeAttribute("onclick");

    document.getElementById("messageList").innerHTML = "";
    if (chat?.messages?.length) {
        $(".noResult").hide();
        for (const message of chat.messages) {

            if (message.senderId?.toString() == globalProfile?._id?.toString()) {
                const div = document.createElement("div");
                div.className = "me";
                div.innerHTML = `
                <img class="chatImage" src="${meImage}" alt="" srcset="">
                <span class="mx-2">${message.body}</span>
                `;
                document.getElementById("messageList").appendChild(div);
            } else {

                const div = document.createElement("div");
                div.className = "myFriend";
                div.innerHTML = `
                <img class="chatImage" src="${friendImage}" alt="" srcset="">
                <span class="mx-2">${message.body}</span>
                `;
                document.getElementById("messageList").appendChild(div);
            }

        }
    } else {
        const div = document.createElement("div");

        div.className = "noResult";
        div.innerHTML = `
            <span class="mx-2">Say Hi to start the conversation.</span>
        `;
        document.getElementById("messageList").appendChild(div);
    }

    // Scroll to the bottom of messages
    const messageList = document.getElementById("messageList");
    messageList.scrollTop = messageList.scrollHeight;
}

//get chat conversation between 2 users and pass it to ShowData function to display it
function displayChatData(userId) {
    // Show loading indicator
    document.getElementById("messageList").innerHTML = `
        <div class="flex justify-center items-center h-full">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    `;

    axios({
        method: "get",
        url: `${baseURL}/chat/history/${userId}`,
        headers
    }).then(function (response) {
        const chat = response.data;
        console.log("Chat", chat);
        if (chat) {
            // handleImages
            if (chat.senderId?._id?.toString() == globalProfile?._id?.toString()) {
                meImage = chat.senderId?.profilePicture?.url.replace("/upload/", "/upload/w_100,h_100,c_thumb/") || avatar;
                friendImage = chat.receiverId?.profilePicture?.url.replace("/upload/", "/upload/w_100,h_100,c_thumb/") || avatar;
            } else {
                friendImage = chat.senderId?.profilePicture?.url.replace("/upload/", "/upload/w_100,h_100,c_thumb/") || avatar;
                meImage = chat.receiverId?.profilePicture?.url.replace("/upload/", "/upload/w_100,h_100,c_thumb/") || avatar;
            }

            showData(userId, chat);
        } else {
            showData(userId, 0);
        }

    }).catch(function (error) {
        console.log(error);
        console.log({ status: error.status });
        if (error.status == 404) {
            showData(userId, 0);
        } else {
            document.getElementById("messageList").innerHTML = `
                <div class="noResult">
                    <span>Oops! Something went wrong.</span>
                </div>
            `;
        }
    });
}

// Display Friends Data
function GetFriends() {
    axios({
        method: "get",
        url: `${baseURL}/chat/connections-list`,
        headers
    }).then(function (response) {
        console.log(response.data);

        const { user, connections, isHR } = response.data;
        const resizedProfile = user.profilePicture?.url?.replace("/upload/", "/upload/w_100,h_100,c_thumb/") || avatar;
        globalProfile = { ...user, profilePicture: { url: resizedProfile } };
        document.getElementById("userName").innerHTML = `${user.firstName} ${isHR ? "(HR)" : ""}`;
        showUsersData(connections);
    }).catch(function (error) {
        console.log(error);
    });
}

// Show friends list
function showUsersData(users = []) {
    let cartonna = "";
    if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
            cartonna += `
            <div onclick="displayChatData('${users[i]._id}')" class="chatUser my-2 hover:bg-gray-700 rounded-md flex items-center">
                <div class="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                <span class="ps-2">${users[i].firstName} ${users[i].lastName}</span>
            </div>
            `;
        }
    } else {
        cartonna = "<div class=\"text-gray-400 text-center p-2\">No friends found</div>";
    }
    document.getElementById("friends").innerHTML = cartonna;
}

GetFriends();