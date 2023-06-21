import { sizeInBToMb } from "@/lib/utils";
import { useReadable } from "react-use-svelte-store";
import { usedStorage } from "@/stores";
import Script from "next/script";

export default function Subscription() {
  const $usedStorage = useReadable(usedStorage);

  const showSubs =
    typeof document !== "undefined"
      ? !!document.location.search.match(/subscription/)
      : false;

  return (
    <div className="rounded-md bg-antiflash shadow-md p-4">
      <h2 className="text-center text-2xl mb-4 opacity-80">Storage</h2>
      {/* <p className="opacity-50 text-center mb-4">
              Free up to 20MB of files storage
            </p> */}
      <div className="flex text-3xl items-center justify-center mb-4 space-x-4">
        <div className="text-right text-3xl opacity-75">You are using</div>
        <div className="bg-saffron/10 border-saffron/40 text-night/50 font-bold border-2 rounded-lg p-8 text-center">
          <div>{sizeInBToMb($usedStorage)}mb / 15mb</div>
          <div className="text-lg font-normal">of free storage</div>
        </div>
      </div>
      {showSubs ? (
        <>
          <h2 className="text-center text-2xl mb-4 opacity-75">
            Get additional storage
          </h2>
          <Script async src="https://js.stripe.com/v3/pricing-table.js" />
          <stripe-pricing-table
            pricing-table-id="prctbl_1NHqQEJgi8a4J0BVw9r6KNpF"
            publishable-key="pk_test_51NHq08Jgi8a4J0BVZZ38gt8J5eAGsDLb7yu0WGv2MlhodXg8SLaK7cmnzBX8Qz5L1efp1Yy7yellZGUkXYwqtVYr004v6JsQnZ"
          ></stripe-pricing-table>
        </>
      ) : null}
    </div>
  );
}
