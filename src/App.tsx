import { useState, useEffect } from 'react';

import ThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import createGenerateClassName from '@material-ui/styles/createGenerateClassName';
import StylesProvider from '@material-ui/styles/StylesProvider';

import theme from 'theme';
import Home from 'pages/Home';
import { Layout } from 'components/Layout';

const generateClassName = createGenerateClassName({
  disableGlobal: true,
  productionPrefix: 's',
});

interface DocModel {
  name: string;
  version: string;
  url: string;
}

const App = () => {
  const [docs, setDocs] = useState<Array<DocModel>>([]);
  const [docNames, setDocsName] = useState<Array<string>>([]);
  const [docVersions, setDocVerions] = useState<Array<string>>([]);
  const [activeDocUrl, setActiveDocUrl] = useState('');

  useEffect(() => {
    const _docs = ((window as any).ENVIRONMENT.DOCS as Array<DocModel>) || [];
    const _docNames = _docs.map((doc) => doc.name);
    const uniqueueDocNames = [...new Set(_docNames)].sort();
    const _activeDoc = uniqueueDocNames[0];
    const _docVersions = _docs
      .filter((doc) => doc.name === _activeDoc)
      .map((doc) => doc.version)
      .sort();

    const activeVersion = _docVersions[0];
    const docUrl =
      _docs.find((doc) => doc.name === _activeDoc && doc.version == activeVersion)?.url ?? '';

    setDocs(_docs);
    setDocsName(uniqueueDocNames);
    setDocVerions(_docVersions);
    setActiveDocUrl(docUrl);
  }, []);

  const changeDoc = (docName: string) => {
    const versions = docs
      .filter((doc) => doc.name === docName)
      .map((doc) => doc.version)
      .sort();

    const activeVersion = versions[0];
    const docUrl =
      docs.find((doc) => doc.name === docName && doc.version == activeVersion)?.url ?? '';

    setDocVerions(versions);
    setActiveDocUrl(docUrl);
  };

  const changeVersion = (version: string) => {
    const currentDoc = docs.find((t) => t.url === activeDocUrl)?.name || '';
    const docUrl = docs.find((doc) => doc.name === currentDoc && doc.version == version)?.url ?? '';

    setActiveDocUrl(docUrl);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StylesProvider generateClassName={generateClassName}>
        <Layout
          docNames={docNames}
          docVersions={docVersions}
          changeDoc={changeDoc}
          changeVersion={changeVersion}
        >
          {activeDocUrl && <Home url={activeDocUrl} />}
        </Layout>
      </StylesProvider>
    </ThemeProvider>
  );
};

export default App;
