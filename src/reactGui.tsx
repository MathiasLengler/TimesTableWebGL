import * as React from "react";
import {Input} from "./interfaces";
import {Slider, Input as InputComponent} from "react-toolbox";
import {RenderController} from "./render";

interface ReactGuiProps {
  initialInput: Input,
  renderController: RenderController
}

type ReactGuiState = Input;

export class ReactGui extends React.Component<ReactGuiProps, ReactGuiState> {
  constructor(props: ReactGuiProps) {
    super(props);
    this.state = {
      ...props.initialInput
    };
  }

  render() {
    return (
      <div className="react-gui">
        <section>
            <h3>Maths</h3>
            <InputComponent type="number" label="Total Lines" value={this.state.totalLines}
                            onChange={(value: string) => this.handleTotalLines(value)}/>
            <InputComponent type="number" label="Multiplier" value={this.state.multiplier}
                            onChange={(value: Input["multiplier"]) => this.handleMultiplier(value)}/>
        </section>
      </div>
    );
  }

  private handleTotalLines(value: string) {
    const totalLines = parseInt(value);
    this.props.initialInput.totalLines = totalLines;
    this.setState({totalLines});
    this.props.renderController.requestRender("totalLines");
  }

  private handleMultiplier(value: any) {

  }
}