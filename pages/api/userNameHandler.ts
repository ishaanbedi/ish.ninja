import axios from "axios";
import { getXataClient } from "../../src/xata";

const xata = getXataClient();

export default async function handler({ query: { username, did } }: any, res: any): Promise<void> {
  const { APP_SECRET, VER_ACC_TOKEN } = process.env;
  const apiKeyServer = APP_SECRET;

  if (!apiKeyServer || !username) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Missing required parameters."
    });
  }

  const records = await xata.db.usernames.filter("username", username).getAll();

  if (records.length) {
    return res.status(200).json({
      success: false,
      message: "Username already exists"
    });
  }

  await xata.db.usernames.create({
    username: username,
    did: did,
  });

  await axios.post(`https://api.vercel.com/v2/domains/${process.env.NEXT_PUBLIC_APP_NAME}/records`, {
    name: `_atproto.${username}`,
    type: 'TXT',
    value: `did=${did}`,
  }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${VER_ACC_TOKEN}`,
    },
  });

  res.status(200).json({
    success: true
  });
};
