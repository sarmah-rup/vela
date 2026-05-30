import React, {type ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Swagger UI stylesheet at module scope so Docusaurus bundles it (requiring it inside
// the render closure injected it too late → unstyled, vertical text).
import 'swagger-ui-react/swagger-ui.css';

// Interactive API console: Authorize (X-API-Key), per-endpoint "Try it out",
// JSON body editor, live Execute. Client-only via BrowserOnly.
export default function SwaggerSpec(): ReactNode {
  const specUrl = useBaseUrl('/openapi.json');
  return (
    <BrowserOnly fallback={<div style={{padding: '3rem 0', color: 'var(--vela-muted)'}}>Loading API reference…</div>}>
      {() => {
        const SwaggerUI = require('swagger-ui-react').default;
        return (
          <SwaggerUI
            url={specUrl}
            docExpansion="list"
            defaultModelsExpandDepth={0}
            tryItOutEnabled
            persistAuthorization
            displayRequestDuration
          />
        );
      }}
    </BrowserOnly>
  );
}
