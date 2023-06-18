import * as React from "react";
import * as ReactDOM from "react-dom";
import "./app.css";
import logoUrl from "./assets/logo.svg";

// transgendermap.com -- general trans guidebook
// diyhrt.cafe -- safe diy hrt websites for buying
// transfemscience.org -- research, info, and guidance on hormonal transitioning for transfemme (we need the transmasc equivalent, and NB equivalents as well)
// genderdysphoria.fyi -- informative document for both trans people and allies with info about trans history, hrt, and dysphoria
// trans-resources.info -- general list of trans resources
// strandsfortrans.org -- comprehensive map of trans-friendly salons and barbershops
// equaldex.com -- compare lgbtq rights between countries, provinces, and states. look for lgbtq organizations in your location of choice.
// rainbowrailroad.org -- organization assisting lgbtq people from hostile countries make their way to safety.

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
        <p>
          <h4>
            <a href="https://genderdysphoria.fyi">genderdysphoria.fyi</a>
          </h4>
          Information for Both Trans People and Allies About Trans History, HRT,
          and Dysphoria
          <br />
          <br />
          <h4>
            <a href="https://transgendermap.com">transgendermap.com</a>
          </h4>
          A General Guidebook For Trans and Allies
          <br />
          <br />
          <h4>
            <a href="https://diyhrt.cafe">diyhrt.cafe</a>
          </h4>
          Tested DIY HRT Providers
          <br />
          <br />
          <h4>
            <a href="https://transfemscience.org">transfemscience.org</a>
          </h4>
          Research, Info, and Guidance on Hormonal Transitioning for Transfemme
          <br />
          <br />
          <h4>
            <a href="https://strandsfortrans.org">strandsfortrans.org</a>
          </h4>
          Comprehensive Map of Trans-Friendly Salons and Barbershops
          <br />
          <br />
          <h4>
            <a href="https://equaldex.com">equaldex.com</a>
          </h4>
          Compare LGBTQ Rights Between Countries, Provinces, and States
          <br />
          <br />
          <h4>
            <a href="https://rainbowrailroad.org">rainbowrailroad.org</a>
          </h4>
          Organization Assisting LGBTQ People From Hostile Countries Make Their
          Way to Safety
        </p>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
