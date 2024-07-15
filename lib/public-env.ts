import { cleanEnv, str } from "envalid";

export default cleanEnv(
  {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  { NEXT_PUBLIC_RECAPTCHA_SITE_KEY: str() },
);
