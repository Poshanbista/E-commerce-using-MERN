export const categoryFields = {
    Laptop: [
        { name: "ram", label: "RAM", placeholder: "16GB" },
        { name: "ssd", label: "SSD", placeholder: "512GB" },
        { name: "processor", label: "Processor/Generation", placeholder: "M3 Pro, 12-core" },
        { name: "screenSize", label: "Screen Size", placeholder: "14 inch" },
        { name: "battery", label: "Battery", placeholder: "100Wh" },
    ],
    Mouse: [
        { name: "dpi", label: "DPI", placeholder: "16000" },
        { name: "connectivity", label: "Connectivity", placeholder: "Wireless / Bluetooth / USB" },
        { name: "brand", label: "Brand", placeholder: "Logitech, Razer" },
        { name: "sensorType", label: "Sensor Type", placeholder: "Optical / Laser" },
    ],
    Monitor: [
        { name: "screenSize", label: "Screen Size", placeholder: "27 inch" },
        { name: "resolution", label: "Resolution", placeholder: "2560x1440" },
        { name: "refreshRate", label: "Refresh Rate", placeholder: "165Hz" },
        { name: "panelType", label: "Panel Type", placeholder: "IPS / VA / TN / OLED" },
        { name: "responseTime", label: "Response Time", placeholder: "1ms" },
    ],
    Keyboard: [
        { name: "layoutSize", label: "Layout Size", placeholder: "Full Size / TKL / 60%" },
        { name: "switchType", label: "Switch Type", placeholder: "Cherry MX Red / Blue / Brown" },
        { name: "backlight", label: "Backlight", placeholder: "RGB / White / None" },
        { name: "connectivity", label: "Connectivity", placeholder: "Wired / Wireless / Bluetooth" },
    ],
    Headphone: [
        { name: "driverSize", label: "Driver Size", placeholder: "50mm" },
        { name: "frequencyResponse", label: "Frequency Response", placeholder: "20Hz - 20kHz" },
        { name: "connectivity", label: "Connectivity", placeholder: "Wired / Wireless / Bluetooth" },
        { name: "noiseCancellation", label: "Noise Cancellation", placeholder: "Active / Passive / None" },
        { name: "mic", label: "Microphone", placeholder: "Built-in / Detachable / None" },
    ],
}

export const categoryFieldNames = {
    Laptop: ["ram", "ssd", "processor", "screenSize", "battery"],
    Mouse: ["dpi", "connectivity", "brand", "sensorType"],
    Monitor: ["screenSize", "resolution", "refreshRate", "panelType", "responseTime"],
    Keyboard: ["layoutSize", "switchType", "backlight", "connectivity"],
    Headphone: ["driverSize", "frequencyResponse", "connectivity", "noiseCancellation", "mic"],
}
