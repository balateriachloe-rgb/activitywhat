export default async function handler(req, res) {

    const appsScriptUrl = process.env.APPS_SCRIPT_URL;

    if (!appsScriptUrl) {
        return res.status(500).json({
            success: false,
            error: "Apps Script URL is not configured."
        });
    }

    try {

        if (req.method === "GET") {

            const response = await fetch(appsScriptUrl);

            const text = await response.text();

            return res
                .status(response.status)
                .json(JSON.parse(text));
        }

        if (req.method === "POST") {

            const response = await fetch(appsScriptUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req.body)
            });

            const text = await response.text();

            return res
                .status(response.status)
                .json(JSON.parse(text));
        }

        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
