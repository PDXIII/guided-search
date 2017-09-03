import React from "react";
import PropTypes from "prop-types";

const FilterItem = props =>
  <div
    className={`filter-item ${props.className} b i dib pv2 ph3 ma1 br2 f5 lh-solid shadow-hover`}
    onClick={props.toggleActive.bind(null, props)}
  >
    {props.name}
  </div>;

export default FilterItem;

FilterItem.propTypes = {
  name: PropTypes.string.isRequired,
  toggleActive: PropTypes.func.isRequired
};
