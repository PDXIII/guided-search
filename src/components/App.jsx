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
    return _.sortBy(stream, item => _.lowerCase(item.name));
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
      <div className="App system-serif black-50 tc">
        <div className="App-header">
          <h1 className="f1 pa4 ma0 normal i b tl ">Guided Search</h1>
        </div>
        <main>
          <div className="filters-ui">
            <div className="live-search pa2">
              <form
                className="search-form br2 pv3 ph5 dib f3 lh-solid shadow-hover relative w-50"
                action={this.preventDefault}
              >
                <input
                  className="search-field bn tc system-serif w-100 relative dib b i"
                  placeholder="What are you looking for? "
                  type="text"
                  onChange={this.updateSearchQuery}
                />
                <input
                  className="reset-btn bn bg-transparent black-30 grow right-1 absolute"
                  type="reset"
                  value="×"
                  onClick={this.resetSearchQuery}
                />
              </form>
            </div>
            <div className="filters pa1">
              <div className="filter-container w-60 center relative">
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
          </div>
          <div className="results-outlet relative overflow-hidden">
            <h2 className="b i f4">
              {this.state.items.length === this.state.matches.length
                ? `${this.state.matches.length} results`
                : `${this.state.matches.length} of ${this.state.items
                    .length} results`}
            </h2>
            <div className="results-container w-80 center">
              {this.state.matches.map((item, key) =>
                <ResultItem item={item} key={key} />
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
