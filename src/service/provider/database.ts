import { IPage } from "./github";

interface RepoResponse {
  name: string;
  fields: {
    repos: {
      arrayValue: {
        values: {
          stringValue: string;
        }[];
      };
    };
  };
  createTime: string;
  updateTime: string;
}

interface PagesResponse {
  documents: {
    name: string;
    fields: {
      branch: {
        stringValue: string;
      };
      title: {
        stringValue: string;
      };
      repo: {
        stringValue: string;
      };
      path: {
        stringValue: string;
      };
    };
    createTime: string;
    updateTime: string;
  }[];
}

export class RepoProvider {
  serviceUrl = "https://firestore.googleapis.com/v1/projects";

  private projectId: string;

  constructor(projectId: string) {
    this.projectId = projectId;
  }

  getRepos(documentId: string): Promise<void | string[]> {
    var requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };

    return fetch(
      `${this.serviceUrl}/${this.projectId}/databases/(default)/documents/repos/${documentId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((json: RepoResponse) => json.fields.repos.arrayValue.values)
      .then((values) => values.flatMap((value) => value.stringValue))
      .catch((err) => console.log(err));
  }

  getPages(): Promise<void | IPage[]> {
    var requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };

    return fetch(
      `${this.serviceUrl}/${this.projectId}/databases/(default)/documents/pages`,
      requestOptions
    )
      .then((response) => response.json())
      .then((json: PagesResponse) => {
        return json.documents.map((doc) => {
          const page: IPage = {
            branch: doc.fields.branch.stringValue,
            title: doc.fields.title.stringValue,
            repo: doc.fields.repo.stringValue,
            path: doc.fields.path.stringValue,
          };
          return page;
        });
      });
  }
}
