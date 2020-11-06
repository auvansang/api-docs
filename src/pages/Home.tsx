import 'swagger-ui/dist/swagger-ui.css';
import 'assets/css/home.css';

import { useEffect } from 'react';
// @ts-ignore
import SwaggerUI from 'swagger-ui';

import ENV from 'env';

interface Props {
  url: string;
}

interface OAuthConfig {
  realm: string;
  clientId: string;
  clientSecret: string;
  scopeSeparator: string;
  scopes: string;
  usePkceWithAuthorizationCodeGrant: boolean;
}

const Dashboard = (props: Props) => {
  useEffect(() => {
    const docUI = SwaggerUI({
      domNode: document.getElementById('api-docs'),
      url: props.url,
      persistAuthorization: true,
      displayRequestDuration: true,
    });

    if (ENV.CLIENT_ID) {
      let oAuthConfig = {
        clientId: ENV.CLIENT_ID,
        scopeSeparator: ' ',
        scopes: ENV.SCOPES,
        usePkceWithAuthorizationCodeGrant: ENV.USE_PKCE,
      } as OAuthConfig;

      if (ENV.REALM) oAuthConfig = { ...oAuthConfig, realm: ENV.REALM };
      if (ENV.CLIENT_SECRET) oAuthConfig = { ...oAuthConfig, clientSecret: ENV.CLIENT_SECRET };

      docUI.initOAuth(oAuthConfig);
    }
  }, [props.url]);

  return <div id="api-docs"></div>;
};

export default Dashboard;
