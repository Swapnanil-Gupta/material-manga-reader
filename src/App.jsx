import Navbar from "./components/shared/Navbar";
import AllManga from "./components/all-manga";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import SearchManga from "./components/search-manga";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useState } from "react";
import { light, dark } from "./theme";
import { useEffect } from "react";
import MangaDetails from "./components/manga-details";
import ReadChapter from "./components/read-chapter";

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
          <Route path={`/manga/:mangaId/:chapterId`} component={ReadChapter} />
          <Route path={`/manga/:mangaId`} component={MangaDetails} />
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
