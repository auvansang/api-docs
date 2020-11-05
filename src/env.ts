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
  USE_PKCE: boolean;
  DOCS: Array<ApiDoc>;
}

const ENV = (window as any).ENV as ENVIRONTMENT;

export default ENV;
