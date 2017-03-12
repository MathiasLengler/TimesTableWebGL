import * as React from "react";
import * as ReactDOM from "react-dom";
import {Layout, Panel, NavDrawer, AppBar, Checkbox, Sidebar, IconButton} from "react-toolbox";
import {RenderContainer} from "./interfaces";
import {initRender} from "./index";
import {ReactGui} from "./reactGui";
import {getInitialInput} from "./config";
import {RenderController} from "./render";

export function renderReact() {
  const component = <App/>;

  ReactDOM.render(
    component,
    getReactRoot()
  );
}

function getReactRoot() {
  const reactRoot = document.createElement("div");
  reactRoot.id = "react-root";
  document.body.appendChild(reactRoot);

  return reactRoot;
}

interface AppState {
  bodyScrolled: boolean
  sideNavActive: boolean
  sideNavPinned: boolean
  sideNavClipped: boolean
  rightSideNavActive: boolean
  rightSideNavPinned: boolean
  rightSideNavClipped: boolean
  renderController?: RenderController
}

const initialInput = getInitialInput();

class App extends React.Component<{}, AppState> {
  private renderContainer?: RenderContainer;

  state: AppState = {
    bodyScrolled: true,
    sideNavActive: false,
    sideNavPinned: false,
    sideNavClipped: false,
    rightSideNavActive: false,
    rightSideNavPinned: false,
    rightSideNavClipped: false,
  };

  handleToggle = (param: keyof AppState) => {
    this.setState({[param]: !this.state[param]} as any);
  };

  componentWillMount() {
    console.log(this.renderContainer);
  }

  componentDidMount() {
    console.log(this.renderContainer);

    const renderController = initRender(initialInput, this.renderContainer);

    this.setState({renderController});
  }

  render() {
    const {sideNavActive, rightSideNavActive} = this.state;
    return (
      <Layout>
        <NavDrawer
          active={sideNavActive}
          clipped={this.state.sideNavClipped}
          onOverlayClick={this.handleToggle.bind(this, 'sideNavActive')}
          permanentAt="md"
          pinned={this.state.sideNavPinned}
        >
          {this.state.renderController ?
            <ReactGui initialInput={initialInput} renderController={this.state.renderController}/>
            : null}

        </NavDrawer>

        <AppBar
          fixed
          rightIcon='more'
          leftIcon='menu'
          onLeftIconClick={this.handleToggle.bind(this, 'sideNavActive')}
          title="Super Layout with a large text to be covered!"
        />

        <Panel bodyScroll={this.state.bodyScrolled}>

          <div id="render-container" ref={node => this.renderContainer = node}/>

          <section style={{ margin: '1.8rem'}}>
            <h5 style={{ marginBottom: 20 }}>SideNav State</h5>
            <Checkbox
              label='Pinned'
              checked={this.state.sideNavPinned}
              onChange={this.handleToggle.bind(this, 'sideNavPinned')}
            />

            <Checkbox
              label='Clipped'
              checked={this.state.sideNavClipped}
              onChange={this.handleToggle.bind(this, 'sideNavClipped')}
            />

            <Checkbox
              label="Right SideNav Active"
              checked={this.state.rightSideNavActive}
              onChange={this.handleToggle.bind(this, 'rightSideNavActive')}
            />

            <Checkbox
              label="Right SideNav Pinned"
              checked={this.state.rightSideNavPinned}
              onChange={this.handleToggle.bind(this, 'rightSideNavPinned')}
            />

            <Checkbox
              label="Right SideNav Clipped"
              checked={this.state.rightSideNavClipped}
              onChange={this.handleToggle.bind(this, 'rightSideNavClipped')}
            />

            <Checkbox
              label="Body scrolled"
              checked={this.state.bodyScrolled}
              onChange={this.handleToggle.bind(this, 'bodyScrolled')}
            />
          </section>
        </Panel>

        <Sidebar
          active={rightSideNavActive}
          onOverlayClick={this.handleToggle.bind(this, 'rightSideNavActive')}
          clipped={this.state.rightSideNavClipped}
          pinned={this.state.rightSideNavPinned}
          width={11}
        >
          <p>
            I'm a Sidebar content.
          </p>
        </Sidebar>
      </Layout>
    );
  }
}