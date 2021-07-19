export interface IDocument {
  id: string;
  repo: string;
  branch: string;
  path: string;
  title: string;
}

interface DocumentListResponse {
  status: number;
  message: string;
  data: IDocument[];
}

export class RepoProvider {
  serviceUrl =
    "https://us-central1-test-1-300600.cloudfunctions.net/bloglog-database-dev-documentList";

  listDocuments(): Promise<void | IDocument[]> {
    var requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };

    return fetch(`${this.serviceUrl}`, requestOptions)
      .then((response) => response.json())
      .then((json: DocumentListResponse) => {
        console.log(json);
        switch (json.status) {
          case 200:
            return json.data;
          default:
            throw new Error(json.message);
        }
      });
  }
}
