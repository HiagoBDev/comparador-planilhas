import { HashRouter, Routes, Route, Link } from "react-router-dom"

function Home() {
  return <div>
    <h1>
      teste
    </h1>
    <Link to="/comparador">Ir para comparador</Link>
  </div>;
}

function Comparador() {
  return <div>
    <h1>
      Comparador
    </h1>
    <Link to="/">Ir para home</Link>
  </div>;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparador" element={<Comparador />} />
      </Routes>
    </HashRouter>
  )
}

export default App
