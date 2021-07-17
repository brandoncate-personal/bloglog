import "./App.css";

import Page from "./Page";

import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { IPage } from "./service/provider/github";
import { RepoProvider } from "./service/provider/database";
import Install from "./Install";

function App() {
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
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link
                  to={{
                    pathname:
                      "https://github.com/apps/bloglog-bot/installations/new",
                  }}
                  target="_blank"
                >
                  Install in Github
                </Link>
              </li>
              <li>
                <Link to="/">Home</Link>
              </li>
              {pages.length > 0 &&
                pages.map((page, index) => (
                  <li key={`${index}-${page.repo}-${page.path}`}>
                    <Link to={getRepoSlug(page)}>{page.title}</Link>
                  </li>
                ))}
            </ul>
          </nav>

          <Switch>
            <Route path="/install" children={<Install />} />
            <Route path="/:id" children={<Page />} />
          </Switch>
        </header>
      </div>
    </Router>
  );
}

function getRepoSlug(page: IPage): string {
  const splitRepo = page.repo.split("/");
  const slug = `/github/${splitRepo[splitRepo.length - 2]}/${
    splitRepo[splitRepo.length - 1]
  }/${page.branch}/${page.path}`;
  return slug;
}

export default App;
