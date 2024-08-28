let userData = {
    name: "",
    phone: "",
    date: "",
    tickets: {},
    idType: "",
    idNumber: ""
};

function clearChat() {
    const chatbox = document.getElementById("chatbox");
    chatbox.innerHTML = "";
}

function showTypingIndicator(callback) {
    const typingIndicator = document.getElementById("typingIndicator");
    typingIndicator.style.display = "flex";
    setTimeout(() => {
        typingIndicator.style.display = "none";
        callback();
    }, 1500);
}

function appendMessage(message, sender) {
    const chatbox = document.getElementById("chatbox");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
    messageDiv.textContent = message;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function startBooking() {
    userData = { name: "", phone: "", date: "", tickets: {}, idType: "", idNumber: "" };
    clearChat();
    appendMessage("Good morning! How may I assist you?", "bot");
    showSuggestions();
}

function showSuggestions() {
    const chatbox = document.getElementById("chatbox");
    const suggestionsDiv = document.createElement("div");
    suggestionsDiv.classList.add("suggestions");

    const bookTicketButton = document.createElement("button");
    bookTicketButton.textContent = "Book a Ticket";
    bookTicketButton.onclick = function() {
        clearChat();
        showTypingIndicator(askName);
    };

    const viewTicketButton = document.createElement("button");
    viewTicketButton.textContent = "View My Ticket";
    viewTicketButton.onclick = function() {
        clearChat();
        appendMessage("This functionality is not implemented yet.", "bot");
    };

    suggestionsDiv.appendChild(bookTicketButton);
    suggestionsDiv.appendChild(viewTicketButton);
    chatbox.appendChild(suggestionsDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function askName() {
    appendMessage("Please provide your name:", "bot");
    document.getElementById("userInput").disabled = false;
    document.getElementById("submitButton").onclick = saveName;
}

function saveName() {
    const name = document.getElementById("userInput").value.trim();
    const namePattern = /^[a-zA-Z\s]+$/;
    if (name && namePattern.test(name)) {
        userData.name = name;
        appendMessage(name, "user");
        document.getElementById("userInput").value = "";
        document.getElementById("userInput").disabled = true;
        showTypingIndicator(askPhoneNumber);
    } else {
        alert("Please enter a valid name (letters and spaces only).");
    }
}

function askPhoneNumber() {
    appendMessage("Please provide your 10-digit contact number:", "bot");
    document.getElementById("userInput").disabled = false;
    document.getElementById("submitButton").onclick = savePhoneNumber;
}

function savePhoneNumber() {
    const phone = document.getElementById("userInput").value.trim();
    const phonePattern = /^[0-9]{10}$/;
    if (phone && phonePattern.test(phone)) {
        userData.phone = phone;
        appendMessage(phone, "user");
        document.getElementById("userInput").value = "";
        document.getElementById("userInput").disabled = true;
        showTypingIndicator(askIdType);
    } else {
        alert("Please enter a valid 10-digit phone number.");
    }
}

function askIdType() {
    appendMessage("Please select your ID type:", "bot");
    const chatbox = document.getElementById("chatbox");
    chatbox.innerHTML += `
        <div class="id-type-options">
            <button onclick="selectIdType('Aadhar Card')">Aadhar Card</button>
            <button onclick="selectIdType('PAN Card')">PAN Card</button>
        </div>
    `;
    chatbox.scrollTop = chatbox.scrollHeight;
}

function selectIdType(type) {
    userData.idType = type;
    appendMessage(type, "user");
    document.getElementById("userInput").disabled = true;
    document.querySelector(".id-type-options").remove();
    showTypingIndicator(askIdNumber);
}

function askIdNumber() {
    appendMessage(`Please enter your ${userData.idType} number:`, "bot");
    document.getElementById("userInput").disabled = false;
    document.getElementById("submitButton").onclick = saveIdNumber;
}

function saveIdNumber() {
    const idNumber = document.getElementById("userInput").value.trim();
    if (idNumber) {
        userData.idNumber = idNumber;
        appendMessage(idNumber, "user");
        document.getElementById("userInput").value = "";
        document.getElementById("userInput").disabled = true;
        showTypingIndicator(askDate);
    } else {
        alert("Please enter a valid ID number.");
    }
}

function askDate() {
    appendMessage("Please select the date you want to visit:", "bot");
    const chatbox = document.getElementById("chatbox");
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.id = "dateInput";
    chatbox.appendChild(dateInput);
    chatbox.scrollTop = chatbox.scrollHeight;
    dateInput.onchange = showTicketOptions;
}

function showTicketOptions() {
    const date = document.getElementById("dateInput").value;
    if (date) {
        userData.date = date;
        appendMessage(date, "user");
        const chatbox = document.getElementById("chatbox");
        chatbox.innerHTML += `
            <div class="ticket-options">
                <div class="ticket-type">
                    <label>Normal Ticket - $10:</label>
                    <div class="increment">
                        <button onclick="changeTicket('normal', -1)">-</button>
                        <input type="text" id="normalCount" value="0" readonly>
                        <button onclick="changeTicket('normal', 1)">+</button>
                    </div>
                </div>
                <div class="ticket-type">
                    <label>VIP Ticket - $20:</label>
                    <div class="increment">
                        <button onclick="changeTicket('vip', -1)">-</button>
                        <input type="text" id="vipCount" value="0" readonly>
                        <button onclick="changeTicket('vip', 1)">+</button>
                    </div>
                </div>
                <div class="ticket-type">
                    <label>Student Ticket - $5:</label>
                    <div class="increment">
                        <button onclick="changeTicket('student', -1)">-</button>
                        <input type="text" id="studentCount" value="0" readonly>
                        <button onclick="changeTicket('student', 1)">+</button>
                    </div>
                </div>
                <div>Total Price: $<span id="totalPrice">0</span></div>
            </div>
            <button onclick="showPreview()">Next</button>
        `;
        chatbox.scrollTop = chatbox.scrollHeight;
    } else {
        alert("Please select a valid date.");
    }
}

function changeTicket(type, increment) {
    const countInput = document.getElementById(`${type}Count`);
    let count = parseInt(countInput.value, 10);
    count = Math.max(0, count + increment);
    countInput.value = count;

    const prices = { normal: 10, vip: 20, student: 5 };
    const totalPrice = (parseInt(document.getElementById("normalCount").value, 10) * prices.normal) +
                        (parseInt(document.getElementById("vipCount").value, 10) * prices.vip) +
                        (parseInt(document.getElementById("studentCount").value, 10) * prices.student);

    document.getElementById("totalPrice").textContent = totalPrice;
}

function showPreview() {
    appendMessage("Please confirm your details:", "bot");

    const chatbox = document.getElementById("chatbox");
    const previewBox = document.createElement("div");
    previewBox.id = "previewBox";

    const header = document.createElement("div");
    header.className = "header";
    header.textContent = "Preview Your Details";
    previewBox.appendChild(header);

    const namePara = document.createElement("p");
    namePara.textContent = `Name: ${userData.name}`;
    previewBox.appendChild(namePara);

    const phonePara = document.createElement("p");
    phonePara.textContent = `Phone: ${userData.phone}`;
    previewBox.appendChild(phonePara);

    const datePara = document.createElement("p");
    datePara.textContent = `Visiting Date: ${userData.date}`;
    previewBox.appendChild(datePara);

    const idTypePara = document.createElement("p");
    idTypePara.textContent = `ID Type: ${userData.idType}`;
    previewBox.appendChild(idTypePara);

    const idNumberPara = document.createElement("p");
    idNumberPara.textContent = `ID Number: ${userData.idNumber}`;
    previewBox.appendChild(idNumberPara);

    const totalPrice = calculateTotalPrice();
    const pricePara = document.createElement("p");
    pricePara.textContent = `Total Ticket Price: $${totalPrice}`;
    previewBox.appendChild(pricePara);

    chatbox.appendChild(previewBox);

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm & Submit";
    confirmButton.onclick = submitFormData;
    chatbox.appendChild(confirmButton);

    const startOverButton = document.createElement("button");
    startOverButton.textContent = "Start Over";
    startOverButton.onclick = startBooking;
    chatbox.appendChild(startOverButton);

    chatbox.scrollTop = chatbox.scrollHeight;
}

function calculateTotalPrice() {
    const prices = { normal: 10, vip: 20, student: 5 };
    const normalCount = parseInt(document.getElementById("normalCount").value, 10) || 0;
    const vipCount = parseInt(document.getElementById("vipCount").value, 10) || 0;
    const studentCount = parseInt(document.getElementById("studentCount").value, 10) || 0;

    return (normalCount * prices.normal) + (vipCount * prices.vip) + (studentCount * prices.student);
}

function submitFormData() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "submit.php", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const chatbox = document.getElementById("chatbox");
            chatbox.innerHTML = `
                <div class="message bot-message">Thank you, ${userData.name}! Your details have been saved successfully.</div>
            `;
            showSuggestions();
        }
    };
    xhr.send(JSON.stringify({
        name: userData.name,
        phone: userData.phone,
        date: userData.date,
        idNumber: userData.idNumber
    }));
}

window.onload = function() {
    startBooking();
};
