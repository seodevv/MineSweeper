const React = require("react");
const ReactDOM = require("react-dom/client");
const { default: Mine } = require("./Mine");

const root = document.querySelector("#root");

ReactDOM.createRoot(root).render(
  <>
    <Mine />
  </>
);
