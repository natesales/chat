// script.js

const adjectives = [
    "Defiant",
    "Homeless",
    "Adorable",
    "Delightful",
    "Homely",
    "Quaint",
    "Adventurous",
    "Depressed",
    "Horrible",
    "Aggressive",
    "Determined",
    "Hungry",
    "Real",
    "Agreeable",
    "Different",
    "Hurt",
    "Relieved",
    "Alert",
    "Difficult",
    "Repulsive",
    "Alive",
    "Disgusted",
    "Ill",
    "Rich",
    "Amused",
    "Distinct",
    "Important",
    "Angry",
    "Disturbed",
    "Impossible",
    "Scary",
    "Annoyed",
    "Dizzy",
    "Inexpensive",
    "Selfish",
    "Annoying",
    "Doubtful",
    "Innocent",
    "Shiny",
    "Anxious",
    "Drab",
    "Inquisitive",
    "Shy",
    "Arrogant",
    "Dull",
    "Itchy",
    "Silly",
    "Ashamed",
    "Sleepy",
    "Attractive",
    "Eager",
    "Jealous",
    "Better",
    "Encouraging",
    "Stormy",
    "Bewildered",
    "Energetic",
    "Lazy",
    "Strange",
    "Black",
    "Enthusiastic",
    "Light",
    "Stupid",
    "Bloody",
    "Envious",
    "Lively",
    "Successful",
    "Blue",
    "Nervous",
    "Wild",
    "Curious",
    "Poor",
    "Witty",
    "Cute",
    "Handsome",
    "Powerful",
    "Worrisome",
    "Happy",
    "Precious",
    "Worried",
    "Dangerous",
    "Healthy",
    "Prickly",
    "Wrong",
    "Dark",
    "Helpful",
    "Proud",
    "Helpless",
    "Putrid",
    "Zany",
    "Defeated",
    "Hilarious",
    "Puzzled",
    "Zealous"
];

const nouns = [
    "Frog",
    "Newt",
    "Tadpole",
    "Toad",
    "Scorpion",
    "Spider",
    "Tarantula",
    "Albatross",
    "Biddy",
    "Blackbird",
    "Canary",
    "Crow",
    "Cuckoo",
    "Dove",
    "Pigeon",
    "Duck",
    "Eagle",
    "Falcon",
    "Finch",
    "Flamingo",
    "Goose",
    "Gull",
    "Hawk",
    "Jackdaw",
    "Jay",
    "Kookaburra",
    "Mallard",
    "Ostrich",
    "Owl",
    "Parakeet",
    "Parrot",
    "Peacock",
    "Pelican",
    "Penguin",
    "Pheasant",
    "Piranha",
    "Raven",
    "Robin",
    "Rooster",
    "Sparrow",
    "Stork",
    "Swallow",
    "Turkey",
    "Vulture",
    "Woodpecker",
    "Peacock",
    "Silkworm",
    "Crab",
    "Eel",
    "Goldfish",
    "Halibut",
    "Jellyfish",
    "Lobster",
    "Perch",
    "Salmon",
    "Scallop",
    "Shark",
    "Shell",
    "Shrimp",
    "Trout",
    "Ant",
    "Aphid",
    "Bee",
    "Beetle",
    "Bumblebee",
    "Caterpillar",
    "Cockroach",
    "Dragonfly",
    "Flea",
    "Fly",
    "Gadfly",
    "Grasshopper",
    "Larva",
    "Midge",
    "Millipede",
    "Moth",
    "Wasp",
    "Anteater",
    "Antelope",
    "Armadillo",
    "Badger",
    "Bat",
    "Bear",
    "Beaver",
    "Camel",
    "Chimpanzee",
    "Dachshund",
    "Dolphin",
    "Elephant"
]

let username = adjectives[Math.floor(adjectives.length * Math.random())] + nouns[Math.floor(nouns.length * Math.random())]
// let socket = io.connect("https://chat.natesales.net");
let socket = io.connect('http://127.0.0.1:7000');

const room_id = window.location.href.split("chat/")[1];

$(window).on('beforeunload', function(){
    socket.close();
});

function sanitize(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

socket.on("connect", function () {

    socket.emit("join-room", {
        'room': room_id,
    });

    socket.emit("message", {
        username: username,
        message: " joined the chat.",
        'room': room_id
    });

    $("form").on("submit", function (e) {
        e.preventDefault()
        const message = $("input.message").val();

        switch(message.split(" ")[0]) {
            case "/nick":
                socket.emit("message", {
                    username: username,
                    message: " is now known as " + message.split(" ")[1],
                    'room': room_id,
                });
                username = message.split(" ")[1];
                break;
            case "/bomb":
                socket.emit("bomb", {
                    username: username,
                    message: "bomb",
                    'room': room_id,
                });
                let toDel = document.getElementsByClassName(sanitize(username));
                while(toDel[0]) {
                    toDel[0].parentNode.removeChild(toDel[0]);
                }
            break;
            default:
                if (message !== "" && message !== " ") {
                    socket.emit("message", {
                        username: username,
                        message: message,
                        'room': room_id,
                    });
                }
            }

        document.getElementById("message").value = "";
    });
});

socket.on("message", function (msg) {
    if (typeof msg.username !== 'undefined') {
        $('#holder').append("<div class=" + sanitize(msg.username) + "><i>" + sanitize(msg.username) + ": </i> " + sanitize(msg.message) + "</div>");
        $('#holder').scrollTop($('#holder')[0].scrollHeight);
    }
})

socket.on("bomb", function (bomb) {
    if (typeof bomb.username !== 'undefined') {
        let toDel = document.getElementsByClassName(sanitize(bomb.username));
        while(toDel[0]) {
            toDel[0].parentNode.removeChild(toDel[0]);
        }
    }
})

function clearMessages() {
    document.getElementById("holder").innerHTML = 'Welcome! To change your nickname, type "/nick NICKNAME" where NICKNAME is your desired nickname.'
}

function sendTyping() {
    socket.emit("typing", {username: username, 'room': room_id});
}

window.setInterval(function() {
    document.getElementById("typing").innerText = "";
}, 2500);

socket.on("typing", function (data) {
    document.getElementById("typing").innerText = sanitize(data.username) + " is typing."
})


