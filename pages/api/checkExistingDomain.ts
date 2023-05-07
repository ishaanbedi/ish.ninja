import { getXataClient } from "../../src/xata";

const xata = getXataClient();

export default async function handler({ query: { did } }: any, res: any): Promise<void> {
    const { APP_SECRET } = process.env;
    const apiKeyServer = APP_SECRET;

    if (!apiKeyServer) {
        return res.status(400).json({
            error: "Unauthorized",
            message: "You cannot access this endpoint without a valid API key set as an environment variable."
        });
    }

    if (!did) {
        return res.status(400).json({
            error: "Missing did",
            message: "You must provide a did."
        });
    }

    const records = await xata.db.usernames
        .filter("did", did)
        .getAll();

    if (records.length) {
        return res.status(200).json({
            success: true,
            message: "Existing username",
            username: records[0].username
        });
    }

    return res.status(200).json({
        success: false,
        message: "New username"
    });
};
