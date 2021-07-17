export interface IPage {
  repo: string;
  branch: string;
  path: string;
  title: string;
}

interface PageResponse {
  repo: string;
  branch: string;
  data: DataResponse[];
}

interface DataResponse {
  path: string;
  title: string;
}

export class PageProvider {
  private serviceUrl =
    "https://us-central1-test-1-300600.cloudfunctions.net/my-service-dev-first";
  private REPO_QUERY_KEY = "repo";

  private repos: string[];

  constructor(repos: string[]) {
    this.repos = repos;
  }

  getPages(): Promise<void | IPage[]> {
    var requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };

    return Promise.all(
      this.repos
        .map((repo) => new URLSearchParams({ [this.REPO_QUERY_KEY]: repo }))
        .map((queryParams) =>
          fetch(`${this.serviceUrl}?${queryParams.toString()}`, requestOptions)
        )
    )
      .then((responses) =>
        Promise.all(responses.map((res) => res.json())).catch((err) =>
          console.log(err)
        )
      )
      .then((datas: void | PageResponse[]) => {
        if (datas !== undefined) {
          const pages = datas
            .map((data) =>
              data.data.map((content) => {
                const page: IPage = {
                  repo: data.repo,
                  branch: data.branch,
                  path: content.path,
                  title: content.title,
                };
                return page;
              })
            )
            .flatMap((data: IPage[]) => data);

          return pages;
        }
      })
      .catch((err) => console.log(err));
  }
}
