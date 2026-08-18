async function sendMessage() {

    const message =
        document.getElementById("message").value.trim();

    const key =
        document.getElementById("key").value.trim();

    const status =
        document.getElementById("status");

    if (!message || !key) {
        status.textContent =
            "Please enter a message and secret key.";

        return;
    }

    try {

        const ciphertext =
            vigenereEncrypt(message, key);

        const response = await fetch("/api/messages", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                ciphertext: ciphertext,
                plaintext: message,
                key: key
            })
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error);
        }

        status.textContent =
            "Message encrypted and published!";

        document.getElementById("message").value = "";
        document.getElementById("key").value = "";

        loadMessages();

    } catch (error) {

        status.textContent =
            "Error: " + error.message;

    }
}


async function loadMessages() {

    const feed =
        document.getElementById("feed");

    try {

        const response =
            await fetch("/api/messages");

        const result =
            await response.json();

        feed.innerHTML = "";

        result.messages.reverse().forEach(message => {

            const item =
                document.createElement("div");

            item.className = "message";

            item.innerHTML = `
                <div class="ciphertext">
                    ${escapeHTML(message.ciphertext)}
                </div>

                <input
                    type="password"
                    placeholder="Enter secret key"
                    class="decrypt-key"
                >

                <button>Decrypt</button>

                <div class="decrypted"></div>
            `;

            const button =
                item.querySelector("button");

            const keyInput =
                item.querySelector(".decrypt-key");

            const output =
                item.querySelector(".decrypted");

            button.onclick = () => {

                try {

                    output.textContent =
                        vigenereDecrypt(
                            message.ciphertext,
                            keyInput.value
                        );

                } catch (error) {

                    output.textContent =
                        "Invalid key.";

                }
            };

            feed.appendChild(item);
        });

    } catch (error) {

        feed.textContent =
            "Unable to load messages.";

    }
}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


loadMessages();
