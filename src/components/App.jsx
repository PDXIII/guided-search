import React, { Component } from "react";
import _ from "lodash";
import api from "../utils/api";
import "./App.css";
import "tachyons/css/tachyons.css";

import FilterItem from "./FilterItem";
import ResultItem from "./ResultItem";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: [],
      filtersActive: [],
      items: [],
      stream: [],
      matches: [],
      searchQuery: ""
    };

    this.applyFilters = this.applyFilters.bind(this);
    this.preventDefault = this.preventDefault.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.updateSearchQuery = this.updateSearchQuery.bind(this);
    this.resetSearchQuery = this.resetSearchQuery.bind(this);
  }

  componentWillMount() {
    api.get.then(results => {
      this.setState({
        items: this.sortByName(results.items),
        stream: this.sortByName(results.items),
        matches: this.sortByName(results.items),
        filters: this.sortByName(results.filters)
      });
    });
  }

  preventDefault(event) {
    event.preventDefault();
  }

  sortByName(stream) {
    return _.sortBy(stream, item => item.name);
  }

  sortByActive(stream) {
    return _.sortBy(stream, item => !item.isActive);
  }

  toggleActive(item) {
    let filters = this.state.filters;
    let items = this.state.items;

    let currentFilter = _.find(filters, filter => filter.id === item.id);
    currentFilter.isActive = !currentFilter.isActive;

    let filtersActive = _.filter(filters, filter => filter.isActive);

    this.setState({
      filters: this.sortByName(filters),
      filtersActive: this.sortByName(filtersActive),
      stream: this.sortByName(this.applyFilters(items, filtersActive)),
      matches: this.sortByName(
        this.applyQuery(
          this.applyFilters(items, filtersActive),
          this.state.searchQuery
        )
      )
    });
  }

  applyFilters(stream, filters) {
    if (filters.length > 0) {
      stream = filters.map(filter =>
        stream.filter(item => item.type === filter.name)
      );
      return _.flatten(stream);
    }
    return stream;
  }

  applyQuery(stream, searchQuery) {
    console.log(searchQuery);
    if (searchQuery.length > 0) {
      return _.filter(stream, item => _.includes(item.name, searchQuery));
    }
    return stream;
  }

  updateSearchQuery(event) {
    let searchQuery = event.target.value;
    let stream = this.state.stream;

    this.setState({
      searchQuery: searchQuery,
      matches: this.sortByName(this.applyQuery(stream, searchQuery))
    });
  }

  resetSearchQuery() {
    let searchQuery = "";
    let stream = this.state.stream;

    this.setState({
      searchQuery: searchQuery,
      matches: this.sortByName(this.applyQuery(stream, searchQuery))
    });
  }

  render() {
    return (
      <div className="App system-sans black-50">
        <div className="App-header">
          <h2>Guided Search</h2>
        </div>
        <main>
          <div className="filters-ui">
            <div className="live-search">
              <h2>live search</h2>
              <form
                className="search-form br2 pa3 dib f3 lh-solid shadow-hover"
                action={this.preventDefault}
              >
                <input
                  className="search-field bn tc system-serif b i"
                  placeholder="enter search query"
                  type="text"
                  onChange={this.updateSearchQuery}
                />
                <input
                  className="reset-btn bn bg-transparent black-30 grow"
                  type="reset"
                  value="×"
                  onClick={this.resetSearchQuery}
                />
              </form>
            </div>
            <div className="filters">
              <h2>filters</h2>
              {this.state.filters.map((item, key) =>
                <FilterItem
                  id={item.id}
                  name={item.name}
                  className={
                    item.isActive || this.state.filtersActive.length === 0
                      ? "black-70"
                      : "black-30"
                  }
                  isActive={true}
                  toggleActive={this.toggleActive}
                  key={key}
                />
              )}
            </div>
          </div>
          <div className="results-outlet">
            <h2>search results</h2>
            {this.state.matches.map((item, key) =>
              <ResultItem item={item} key={key} />
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
