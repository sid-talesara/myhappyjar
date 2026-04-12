/**
 * react-native-svg mock for jest.
 * react-native-svg uses native modules that are unavailable in the jest environment.
 * Replace with React.View no-ops so tests can import components that use SVG.
 */
const React = require('react');
const { View } = require('react-native');

const SvgMock = ({ children, ...props }) =>
  React.createElement(View, { testID: 'svg-mock', ...props }, children);

module.exports = SvgMock;
module.exports.default = SvgMock;

// Named exports used by react-native-svg
const svgComponents = [
  'Circle', 'ClipPath', 'Defs', 'Ellipse', 'ForeignObject', 'G', 'Image',
  'Line', 'LinearGradient', 'Marker', 'Mask', 'Path', 'Pattern', 'Polygon',
  'Polyline', 'RadialGradient', 'Rect', 'Stop', 'Svg', 'Symbol', 'TSpan',
  'Text', 'TextPath', 'Use',
];

svgComponents.forEach(name => {
  module.exports[name] = SvgMock;
});
