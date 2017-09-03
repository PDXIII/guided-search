import React from "react";

const ResultItem = props =>
  <div className="result-item">
    <h1>
      {props.item.name}
    </h1>
    <img src={props.item.img} alt="" />
    <p>
      {props.item.type}
    </p>
  </div>;

export default ResultItem;
