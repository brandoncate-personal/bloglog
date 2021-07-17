import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import gfm from "remark-gfm";
import fm from "front-matter";

function Page() {
  let location = useLocation();
  const [text, setText] = useState("");

  useEffect(() => {
    const url = getRepoRaw(location.pathname);

    fetch(url)
      .then((response) => response.text())
      .then((text) => fm(text))
      .then((content) => setText(content.body));
  });

  return (
    <>
      <ReactMarkdown remarkPlugins={[gfm]} children={text} />
    </>
  );
}

function getRepoRaw(path: string): string {
  const splitPath = path.split("/");
  splitPath.shift();
  splitPath.shift();
  const slug = `https://raw.githubusercontent.com/${splitPath.join("/")}`;
  return slug;
}

export default Page;
