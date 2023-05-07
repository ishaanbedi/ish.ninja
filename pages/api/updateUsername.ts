import axios from "axios";
import { getXataClient } from "../../src/xata";

const xata = getXataClient();

export default async function handler({ query: { username, did, oldusername } }: any, res: any): Promise<void> {
  const { APP_SECRET, VERCEL_TOKEN } = process.env;
  const apiKeyServer = APP_SECRET;

  if (!apiKeyServer || !username || !did) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Missing required parameters."
    });
  }

  const records2 = await xata.db.usernames.filter("username", username.replace(`.${process.env.NEXT_PUBLIC_APP_NAME}`, '')).getAll();
  if (records2.length > 0) {
    return res.status(200).json({
      error: "Username already taken",
      message: "Username already taken."
    });
  }

  const records = await xata.db.usernames.filter("username", oldusername.replace(`.${process.env.NEXT_PUBLIC_APP_NAME}`, '')).getAll();
  const id = records[0].id
  const newusername = username.replace(`.${process.env.NEXT_PUBLIC_APP_NAME}`, '');
  await xata.db.usernames.update(id, {
    username: newusername,
    did: did
  });

  const result = await fetch(`https://api.vercel.com/v4/domains/${process.env.NEXT_PUBLIC_APP_NAME}/records`, {
    "headers": {
      "Authorization": `Bearer ${VERCEL_TOKEN}`
    },
    "method": "get"
  });
  const data = await result.json();
  const record = data.records.find((r: any) => r.value === `did=${did}`);
  const record_id = record.id;

  await Promise.all([
    fetch(`https://api.vercel.com/v2/domains/${process.env.NEXT_PUBLIC_APP_NAME}/records/${record_id}`, {
      "headers": {
        "Authorization": `Bearer ${VERCEL_TOKEN}`
      },
      "method": "delete"
    }),
    axios.post(`https://api.vercel.com/v2/domains/${process.env.NEXT_PUBLIC_APP_NAME}/records`, {
      name: `_atproto.${username}`,
      type: 'TXT',
      value: `did=${did}`,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    })
  ]);

  res.status(200).json({
    success: true
  });
};
