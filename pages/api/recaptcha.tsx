import type { NextApiRequest, NextApiResponse } from "next";

const WEBHOOK_URL = process.env.WEBHOOK_URL || (() => { throw "Missing WEBHOOK_URL"; })()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).end();
  }

  const { token, uid } = req.query;
  if (typeof token !== "string") {
    res.status(400).end();
    return;
  }
  if (typeof uid !== "string" || !/^\d+$/.test(uid)) {
    res.status(400).end();
    return;
  }

  const resp = await fetch(
    "https://www.recaptcha.net/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    }
  );

  const json = (await resp.json()) as { success: boolean };

  if (!json.success) {
    res.status(400).end();
    return;
  }

  const wh_resp = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      uid,
      secret: process.env.WEBHOOK_SECRET,
    }),
  });

  if (!wh_resp.ok) {
    res.status(500).end();
    return;
  }

  res.status(204).end();
};

export default handler;
