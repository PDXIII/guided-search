import React, { Component } from "react";
import _ from "lodash";
import api from "../utils/api";
import "./App.css";

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
    this.displayResults = this.displayResults.bind(this);
    // this.filterResults = this.filterResults.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.updateSearchQuery = this.updateSearchQuery.bind(this);
  }

  componentWillMount() {
    api.get.then(results => {
      this.setState({
        items: results.items,
        stream: results.items,
        matches: results.items,
        filters: results.filters
      });
    });
  }

  toggleActive(item) {
    let filters = this.state.filters;
    let items = this.state.items;

    let currentFilter = _.find(filters, filter => filter.id === item.id);
    currentFilter.isActive = !currentFilter.isActive;

    let filtersActive = _.filter(filters, filter => filter.isActive);

    this.setState({
      filters: filters,
      filtersActive: filtersActive,
      stream: this.applyFilters(items, filtersActive),
      matches: this.applyQuery(
        this.applyFilters(items, filtersActive),
        this.state.searchQuery
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

  displayResults() {
    return this.state.matches.length > 0
      ? this.state.matches.map((item, key) =>
          <ResultItem item={item} key={key} />
        )
      : this.state.items.map((item, key) =>
          <ResultItem item={item} key={key} />
        );
  }

  // filterResults() {
  //   console.log(this.state.searchQuery);
  //   let stream = this.applyFilters(this.state.items, this.state.filtersActive);
  //   let matches = this.applyQuery(
  //     this.applyFilters(this.state.items, this.state.filtersActive),
  //     this.state.searchQuery
  //   );
  //   console.log(matches.length);
  //   return this.setState({
  //     stream: stream,
  //     matches: matches
  //   });
  // }

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
      matches: this.applyQuery(stream, searchQuery)
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Guided Search</h2>
        </div>
        <main>
          <div className="filters-ui">
            <div className="live-search">
              <h2>live search</h2>
              <input
                className="search-field"
                placeholder="enter search query"
                type="text"
                onChange={this.updateSearchQuery}
              />
              <p className="query-outlet">
                {this.state.searchQuery}
              </p>
            </div>

            <div className="filters">
              <h2>available filters</h2>
              {this.state.filters.map((item, key) =>
                <FilterItem
                  id={item.id}
                  name={item.name}
                  isActive={true}
                  toggleActive={this.toggleActive}
                  key={key}
                />
              )}
            </div>
            <div className="active-filters">
              <h2>active filters</h2>
              {this.state.filtersActive.map((item, key) =>
                <FilterItem
                  id={item.id}
                  name={item.name}
                  isActive={false}
                  toggleActive={this.toggleActive}
                  key={key}
                />
              )}
            </div>
          </div>
          <div className="results-outlet">
            <h2>search results</h2>
            {// {this.displayResults()}
            this.state.matches.map((item, key) =>
              <ResultItem item={item} key={key} />
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
