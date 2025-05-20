import axios from "axios";

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1374365788181495870/wmUL4yO93ta85QLCCLQm9S9givhYICKx69mfWDhrT2okn2_G38GOVjOJvGV9KH_9Ll1q";

export async function logToDiscord(message: string, level: "INFO" | "WARN" | "ERROR" = "INFO") {
    const colors = {
        INFO: 0x00ff00,
        WARN: 0xffff00,
        ERROR: 0xff0000,
    };

    try {
        await axios.post(DISCORD_WEBHOOK_URL, {
            embeds: [
                {
                    title: `[${level}] - ${new Date().toLocaleString()}`,
                    description: message,
                    color: colors[level],
                },
            ],
        });
    } catch (err) {
        console.log("Erro ao enviar log para Discord:", (err as Error).message);
    }
}
