// import Player from "@/app/components/Player";
// import Layout from "@/app/layout";
import "@/app/globals.css";
import Player from "@/app/components/Player";

export const metadata = {
  title: "Before After Audio Player",
  description: "A simple before after audio player",
};

export default () => (
  <Player playlist={{ mainColor: "#444", altColor: "#777", items: [] }} />
);
