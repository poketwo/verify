import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { Headers } from "node-fetch";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).end();
  }

  const { token } = req.query;
  if (typeof token !== "string") {
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

  if (json.success) {
    res.status(204).end();
  } else {
    res.status(400).end();
  }
};

export default handler;
