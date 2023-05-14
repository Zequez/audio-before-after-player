import ABFile from "./components/ABFile";
import ABFilesContainer from "./components/ABFilesContainer";

export default function Home() {
  const embedValue = `<iframe src="https://app.soundtoggle.io/embed/abst3t3" sandbox="allow-scripts" width="500px" height="815px"/>`;
  return (
    <main className="min-h-screen p-12 max-w-6xl mx-auto">
      <div className="rounded-md bg-[#EEF0F2] shadow-md mb-8 p-4">
        Authentication
      </div>
      <div className="flex mb-8">
        <iframe
          className="rounded-md bg-[#EEF0F2] shadow-md w-[500px] h-[810px] flex-shrink-0"
          src="/matt.html"
        ></iframe>
        <div className="rounded-md bg-[#EEF0F2] shadow-md p-4 flex-grow ml-8">
          <h2 className="text-2xl mb-4 opacity-80">Style</h2>
          <div className="mb-4 flex">
            <div className="bg-white rounded-md flex items-center justify-center px-2 border mr-2">
              <span className="mr-2">Main</span> <input type="color" />
            </div>
            <div className="bg-white rounded-md flex items-center justify-center px-2 border mr-2">
              <span className="mr-2">Alt</span> <input type="color" />
            </div>
          </div>
          <ABFilesContainer />
        </div>
      </div>
      <div className="rounded-md bg-[#EEF0F2] shadow-md p-4">
        <h2 className="text-2xl mb-4 opacity-80">Embed playlist player</h2>
        <div className="flex">
          <input
            type="text"
            className="w-full p-2 rounded-l-md border border-r-0 text-black/50"
            value={embedValue}
          />
          <button className="bg-[#EEC643] text-white font-bold rounded-r-md p-2">
            COPY
          </button>
        </div>
      </div>
    </main>
  );
}
