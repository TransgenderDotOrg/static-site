import * as React from "react";
import * as ReactDOM from "react-dom";

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
    <div>
      <div>
        We're working on something awesome! Things will be changing here quickly
        :)
      </div>
      <div>
        <a href="https://genderdysphoria.fyi">
          genderdysphoria.fyi - Information for Both Trans People and Allies
          About Trans History, HRT, and Dysphoria
        </a>
      </div>
      <div>
        <a href="https://transgendermap.com">
          transgendermap.com - A General Guidebook For Trans and Allies
        </a>
      </div>
      <div>
        <a href="https://diyhrt.cafe">diyhrt.cafe - Tested DIY HRT Providers</a>
      </div>
      <div>
        <a href="https://transfemscience.org">
          transfemscience.org - Research, Info, and Guidance on Hormonal
          Transitioning for Transfemme
        </a>
      </div>
      <div>
        <a href="https://strandsfortrans.org">
          strandsfortrans.org - Comprehensive Map of Trans-Friendly Salons and
          Barbershops
        </a>
      </div>
      <div>
        <a href="https://equaldex.com">
          equaldex.com - Compare LGBTQ Rights Between Countries, Provinces, and
          States
        </a>
      </div>
      <div>
        <a href="https://rainbowrailroad.org">
          rainbowrailroad.org - Organization Assisting LGBTQ People From Hostile
          Countries Make Their Way to Safety
        </a>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
