const helper = require('./helper.js');
const React  = require('react');
const {createRoot} = require('react-dom/client');

const Test = (props) => {
    return (
        <p>yes</p>
    );
};

const init = () => {
    root.render(<Test />, document.getElementById('content'));
};

window.onload = init;