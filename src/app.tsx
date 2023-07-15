import * as React from "react";
import * as ReactDOM from "react-dom";
import "./app.css";
import logoUrl from "./assets/logo.svg";
import appData from "./app-data.json";
import { LinkList } from "./link-list";
import useSearch from "./useSearch";

const App = () => {
  const { results, searchValue, setSearchValue } = useSearch<Post>({
    dataSet: appData.links,
    keys: ["title", "description", "url"],
  });

  return (
    <div className="page one-column">
      <div className="column">
        <div className="tdo-lockup">
          <img src={logoUrl} />
          <h1>Transgender.org</h1>
        </div>
        <h2>We're working on some amazing things for the trans community.</h2>
        <hr />
        <h3>In the meantime, check out these resources:</h3>
        <LinkList links={appData.links} />
        <form>
          <label>Search:</label>
          <input
            type="searchValue"
            id="searchValue"
            name="searchValue"
            onChange={(e) => setSearchValue(e.currentTarget.value)}
          ></input>
        </form>
        {JSON.stringify(results)}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

// ...

interface Post {
  title: any;
  description: any;
  url: any;
  // ... other fields
}

// Search bar here

// Render the results accordingly
