import React from "react";

const ResultItem = props =>
  <div
    style={{ background: `url(${props.item.img})` }}
    className="result-item dib br2 w5 h5 ma2 bg-center cover overflow-hidden relative hide-child"
  >
    <div className="inner-content child bg-black-50 white-90 w-100 h-100 pa3">
      <h1 className="mt0 mb1 tl f2 i">
        {props.item.name}
      </h1>
      <p className="tr i">
        {props.item.type}
      </p>
      <p className="price f3 absolute ma0 pt4 bottom-1 right-1 tr white-50 lh-solid">
        {props.item.price}
      </p>
    </div>
  </div>;

export default ResultItem;
