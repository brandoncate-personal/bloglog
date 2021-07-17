import { Card } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RepoProvider } from "../service/provider/database";
import { IPage } from "../service/provider/github";
import { StyleMap } from "../types/style";

function Home() {
  const projectId = "test-1-300600";
  const documentId = "5romvLJopx6yWr5J6MCb";

  const [pages, setPages] = useState<IPage[]>([]);

  useEffect(() => {
    async function fetchData() {
      const repoProvider = new RepoProvider(projectId);

      const repos = await repoProvider.getRepos(documentId);

      if (repos !== undefined) {
        // const pageProvider = new PageProvider(repos);

        repoProvider
          .getPages()
          .then((pages) => {
            if (pages !== undefined) {
              setPages(pages);
            }
          })
          .catch((err) => console.log(err));
      }
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

function getRepoSlug(page: IPage): string {
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
