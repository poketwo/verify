import { CheckCircleIcon, ExclamationIcon } from "@heroicons/react/solid";
import classd from "classd";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import { useCallback, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

type AlertProps = {
  success: boolean;
};

const Alert = ({ success }: AlertProps) => {
  const color = success ? "green" : "red";
  const Icon = success ? CheckCircleIcon : ExclamationIcon;
  const title = success ? "Success!" : "Error";
  const description = success
    ? "Thanks for verifying! You may now close this page."
    : "An error occurred while verifying. Please try again.";

  return (
    <div className={classd`rounded-md bg-${color}-50 p-4 w-full`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon
            className={classd`h-5 w-5 text-${color}-400`}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className={classd`text-sm font-medium text-${color}-800`}>
            {title}
          </h3>
          <div className={classd`mt-2 text-sm text-${color}-700`}>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = ({ uid }) => {
  const [token, setToken] = useState<string>();
  const [success, setSuccess] = useState<boolean>();

  const handleVerify = async () => {
    const resp = await fetch(`/api/recaptcha?token=${token}&uid=${uid}`, {
      method: "POST",
    });
    setSuccess(resp.ok);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="max-w-xs w-full flex flex-col items-start space-y-5">
        {success !== undefined && <Alert success={success} />}

        <h1 className="text-2xl font-bold">Please verify to continue</h1>

        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          onChange={setToken}
        />

        <button
          type="button"
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={token === undefined}
          onClick={handleVerify}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { uid } = query;

  if (typeof uid !== "string" || !/^\d+$/.test(uid)) {
    return { notFound: true };
  }

  return {
    props: { uid },
  };
};
