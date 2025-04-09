let qrContent = "";
let selectedType = 'url'; // Default QR type

// Function to create input fields dynamically
function createInputFields(type) {
    selectedType = type;
    const qrInputField = document.getElementById('qrContentField');
    qrInputField.innerHTML = ''; // Clear previous inputs

    switch (type) {
        case 'url':
        case 'text':
        case 'phone':
            qrInputField.innerHTML = `<input type="text" id="qrInput" placeholder="Enter content for QR code" />`;
            break;
        case 'wifi':
            qrInputField.innerHTML = `
                <input type="text" id="ssid" placeholder="Enter Wi-Fi SSID" />
                <input type="text" id="password" placeholder="Enter Wi-Fi Password" />
                <label for="encryption" class="select-label">Encryption Type</label>
                <select id="encryption" class="styled-select">
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                </select>
            `;
            break;
        case 'email':
            qrInputField.innerHTML = `
                <input type="email" id="emailAddress" placeholder="Enter email address" />
                <input type="text" id="emailSubject" placeholder="Enter subject" />
                <label for="emailBody" class="textarea-label">Email Body</label>
                <textarea id="emailBody" placeholder="Enter body"></textarea>
            `;
            break;
    }
}

// QR type button listeners
['url', 'text', 'phone', 'wifi', 'email'].forEach(type => {
    document.getElementById(`${type}Btn`).addEventListener('click', () => createInputFields(type));
});

// Generate QR code
document.getElementById('generateBtn').addEventListener('click', function () {
    let qrInput = '';

    if (selectedType === 'wifi') {
        const ssid = document.getElementById('ssid').value;
        const password = document.getElementById('password').value;
        const encryption = document.getElementById('encryption').value;
        qrInput = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    } else if (selectedType === 'email') {
        const email = document.getElementById('emailAddress').value;
        const subject = document.getElementById('emailSubject').value;
        const body = document.getElementById('emailBody').value;
        qrInput = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
        qrInput = document.getElementById('qrInput').value;
    }

    if (qrInput.trim() === "") {
        alert("Please enter content for the QR code.");
        return;
    }

    const qrColor = document.getElementById('qrColor').value;
    const qrSize = document.getElementById('qrSize').value;

    // Clear previous QR code
    const qrCodeDiv = document.getElementById('qrCode');
    qrCodeDiv.innerHTML = "";

    // Generate QR code
    const qr = new QRCode(qrCodeDiv, {
        text: qrInput,
        width: parseInt(qrSize),
        height: parseInt(qrSize),
        colorDark: qrColor,
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Show download buttons
    document.getElementById('downloadButtons2').classList.remove('hidden');
});

// Download PNG
document.getElementById('downloadPngBtn').addEventListener('click', () => {
    const canvas = document.querySelector('#qrCode canvas');
    const svg = document.querySelector('#qrCode svg');

    if (canvas) {
        // Directly download from existing canvas
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'qr-code.png';
        link.click();
    } else if (svg) {
        // Convert SVG to PNG using a temporary canvas
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = function () {
            // Create canvas with proper dimensions
            const width = svg.getBoundingClientRect().width;
            const height = svg.getBoundingClientRect().height;

            const canvasTemp = document.createElement("canvas");
            canvasTemp.width = width;
            canvasTemp.height = height;
            const ctx = canvasTemp.getContext("2d");

            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(url); // Clean up blob URL

            const pngUrl = canvasTemp.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = 'qr-code.png';
            link.click();
        };
        img.onerror = function () {
            console.error("Failed to load SVG image for conversion.");
        };
        img.src = url;
    } else {
        alert("No QR code found to download.");
    }
});


// Optional: update slider value display
document.getElementById('qrSize').addEventListener('input', function () {
    document.getElementById('sizeValue').innerText = `${this.value}px`;
});

// Theme toggle
const themeToggleBtn = document.getElementById('themeToggleBtn');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const mode = document.body.classList.contains('dark-mode') ? 'Light' : 'Dark';
        themeToggleBtn.innerText = `Switch to ${mode} Mode`;
    });
}
