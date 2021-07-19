import { Card } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RepoProvider } from "../service/provider/database";
import { IDocument } from "../service/provider/database";
import { StyleMap } from "../types/style";

function Home() {
  const [pages, setPages] = useState<IDocument[]>([]);

  useEffect(() => {
    async function fetchData() {
      const repoProvider = new RepoProvider();

      repoProvider
        .listDocuments()
        .then((pages) => {
          if (pages !== undefined) {
            setPages(pages);
          }
          console.log(pages)
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, []);

  return (
    <>
      {pages.length > 0 &&
        pages.map((page, index) => (
          <Link
            key={`${index}-${page.repo}-${page.path}`}
            to={getRepoSlug(page)}
          >
            <Card
              key={`${index}-${page.repo}-${page.path}`}
              style={styles.Card}
              hoverable
              title={page.title}
            >
              content description
            </Card>
          </Link>
        ))}
    </>
  );
}

function getRepoSlug(page: IDocument): string {
  const splitRepo = page.repo.split("/");
  const slug = `/github/${splitRepo[splitRepo.length - 2]}/${
    splitRepo[splitRepo.length - 1]
  }/${page.branch}/${page.path}`;
  return slug;
}

const styles: StyleMap = {
  Card: {
    margin: "2rem",
  },
};

export default Home;
