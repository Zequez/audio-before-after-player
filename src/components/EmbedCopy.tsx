import { useRef } from "react";
import Button from "./ui/Button";

const EmbedCopy = ({ value }: { value: string }) => {
  const embedInputBoxEl = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-md bg-[#EEF0F2] shadow-md p-4 mb-8">
      <h2 className="text-2xl mb-4 opacity-80 text-center">
        Embed on your website
      </h2>
      <div className="flex">
        <input
          type="text"
          ref={embedInputBoxEl}
          disabled
          className="w-full p-2 rounded-l-md border border-r-0 border-night/50 shadow-inner text-black/50 bg-white"
          value={value}
          onChange={() => {}}
        />
        <Button
          className="rounded-l-none"
          onClick={() =>
            embedInputBoxEl.current && selectAndCopy(embedInputBoxEl.current)
          }
        >
          COPY
        </Button>
      </div>
    </div>
  );
};

function selectAndCopy(element: HTMLInputElement, copyEnabled = true) {
  window.getSelection()?.removeAllRanges();

  var range = document.createRange();
  range.selectNode(element);
  window.getSelection()?.addRange(range);

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(element.value);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  copyContent();
}

export default EmbedCopy;
