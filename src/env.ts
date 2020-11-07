export interface ApiDoc {
  url: string;
  name: string;
  version: string;
}

interface ENVIRONTMENT {
  REALM: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  SCOPES: string;
  DOCS: Array<ApiDoc>;
}

const ENV = ((window as any).ENV as ENVIRONTMENT) || {
  REALM: '',
  CLIENT_ID: '',
  CLIENT_SECRET: '',
  SCOPES: '',
  DOCS: [],
};

export default ENV;
