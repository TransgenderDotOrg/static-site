import * as React from "react";
import * as ReactDOM from "react-dom";
import "./app.css";
import logoUrl from "./assets/logo.svg";
import appData from "./app-data.json";
import { LinkList } from "./link-list";

const PostList = (posts: any) => {
  const { results, searchValue, setSearchValue } = useSearch<Post>({
    dataSet: appData.links,
    keys: ['title', 'description', 'url'],
  })
}
export default PostList

const App = () => {
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
          <input type="searchValue" id="searchValue" name="searchValue"></input>
        </form>
        {PostList}
      </div>
    </div>
  );
};



ReactDOM.render(<App />, document.getElementById("app"));

import useSearch from './useSearch'
// ...

interface Post {
	title: any
	description: any
	url: any
	// ... other fields
}


	// Search bar here

	// Render the results accordingly

