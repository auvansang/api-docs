import 'swagger-ui/dist/swagger-ui.css';
import 'assets/css/home.css';

import { useEffect } from 'react';
// @ts-ignore
import SwaggerUI from 'swagger-ui';

interface Props {
  url: string;
}

const Dashboard = (props: Props) => {
  useEffect(() => {
    const docUI = SwaggerUI({
      domNode: document.getElementById('api-docs'),
      url: props.url,
      persistAuthorization: true,
      displayRequestDuration: true,
    });

    docUI.initOAuth({
      clientId: 'api-docs',
      scopeSeparator: ' ',
      usePkceWithAuthorizationCodeGrant: true,
    });
  }, [props.url]);

  return <div id="api-docs"></div>;
};

export default Dashboard;
