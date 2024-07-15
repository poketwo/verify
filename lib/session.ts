import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import env from "./env";

type SessionData = Partial<{
  id: string;
  uid: string;
}>;

export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, {
    password: env.SECRET_KEY,
    cookieName: "poketwo-verify",
  });
  return session;
}
