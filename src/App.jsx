import Navbar from "./components/Navbar";
import AllManga from "./components/AllManga";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import SearchManga from "./components/SearchManga";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import MangaDetails from "./components/MangaDetails";
import { useState } from "react";
import { light, dark } from "./theme";
import { useEffect } from "react";

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const appliedTheme = createTheme(theme === "light" ? light : dark);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((theme) => {
      if (theme === "light") return "dark";
      return "light";
    });
  }

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar toggleTheme={toggleTheme} />
        <Switch>
          <Route path="/manga/:mangaId" component={MangaDetails} />
          <Route path="/search" component={SearchManga} />
          <Route path="/all" component={AllManga} />
          <Route path="/">
            <Redirect to="/all" />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
