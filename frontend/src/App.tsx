import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RfcDetail from "./pages/RfcDetail";
import Glossary from "./pages/Glossary";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rfc/:number" element={<RfcDetail />} />
          <Route path="/glossary" element={<Glossary />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
