import React from "react";
import { View } from "react-native";
import { Svg, Defs, Stop } from "expo";
const { Line, Polygon, LinearGradient } = Svg;

export default class StaticTooltip extends React.Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {};
  //   }

  render() {
    return (
      <View>
        <Svg height="310" width="200">
          <Line
            x1="145"
            y1="0"
            x2="145"
            y2="310"
            stroke="#c74675"
            strokeWidth="2"
          />
        </Svg>
      </View>
    );
  }
}
