// import { AppProps } from "next/app";

// export default function SoundToggleApp({
//   Component,
//   pageProps,
// }: AppProps<{ initialSession: Session }>) {
//   // Create a new supabase browser client on every first render.
//   const [supabaseClient] = useState(() => createBrowserSupabaseClient());

//   return (
//     <SessionContextProvider
//       supabaseClient={supabaseClient}
//       initialSession={pageProps.initialSession}
//     >
//       <Component {...pageProps} />
//     </SessionContextProvider>
//   );
// }
