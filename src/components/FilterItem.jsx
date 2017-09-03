import React from "react";
import PropTypes from "prop-types";

const FilterItem = props =>
  <div className="filter-item" onClick={props.toggleActive.bind(null, props)}>
    {props.name}
  </div>;

export default FilterItem;

FilterItem.propTypes = {
  name: PropTypes.string.isRequired,
  toggleActive: PropTypes.func.isRequired
};
