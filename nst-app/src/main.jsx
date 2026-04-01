import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Docs from './Docs.jsx'

function Root() {
  const [page, setPage] = useState("app");
  if (page === "docs") return <Docs onBack={() => setPage("app")} />;
  return <App onDocs={() => setPage("docs")} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
