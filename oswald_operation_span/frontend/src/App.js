import './css/App.scss';

function App() {
    return <div className="App mdc-typography">
        {/* <div className="App"> */}
            <h1 className="mdc-typography--headline1">Header 1</h1>
            <h2 className="mdc-typography--headline2">Header 2</h2>
            <h3 className="mdc-typography--headline3">Header 3</h3>
            <h4 className="mdc-typography--headline4">Header 4</h4>
            <h5 className="mdc-typography--headline5">Header 5</h5>
            <h6 className="mdc-typography--headline6">Header 6</h6>
            <p className="mdc-typography--subtitle1">subtitle 1</p>
            <p className="mdc-typography--subtitle2">subtitle 2</p>
            <p className="mdc-typography--body1">body 1</p>
            <p className="mdc-typography--body2">body 2</p>
            <button className="mdc-typography--button material-button">button</button>
            <p className="mdc-typography--caption">caption</p>
            <p className="mdc-typography--overline">overline</p>
        {/* </div> */}
    </div>;
}

export default App;
