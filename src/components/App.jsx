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
      matches: [],
      searchQuery: ""
    };

    this.addFilter = this.addFilter.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.displayResults = this.displayResults.bind(this);
    this.filterResults = this.filterResults.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
  }

  componentWillMount() {
    api.get.then(results => {
      this.setState({
        items: results.items,
        filters: results.filters
      });
    });
  }

  addFilter(item) {
    let filtersActive = this.state.filtersActive;
    filtersActive.push(item);

    this.setState({
      filtersActive: _.uniqBy(filtersActive, "name")
    });

    this.applyFilters();
  }

  removeFilter(item) {
    let filtersActive = this.state.filtersActive;

    let itemIndex = _.findIndex(filtersActive, function(o) {
      return o.name === item.name;
    });
    console.log(filtersActive);
    console.log(itemIndex);
    filtersActive.splice(itemIndex, 1);
    this.setState({
      filtersActive: _.uniqBy(filtersActive, "name")
    });

    this.applyFilters();
  }

  toggleActive(item) {}

  applyFilters() {
    let results = this.state.items;

    let matches = this.state.filtersActive.map(filter =>
      results.filter(result => result.type === filter.name)
    );

    this.setState({
      matches: _.flatten(matches)
    });
  }

  displayResults() {
    if (this.state.matches.length > 0 || this.state.searchQuery.length > 0) {
      return this.state.matches.map((item, key) =>
        <ResultItem item={item} key={key} />
      );
    }
    return this.state.items.map((item, key) =>
      <ResultItem item={item} key={key} />
    );
  }

  filterResults(event) {
    let searchQuery = event.target.value;

    let matches = this.state.matches.filter(item =>
      item.name.includes(searchQuery)
    );

    console.log(matches);

    this.setState({
      searchQuery: searchQuery,
      matches: _.uniqBy(matches, "id")
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
                onChange={this.filterResults}
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
                  toggleActive={this.addFilter}
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
                  toggleActive={this.removeFilter}
                  key={key}
                />
              )}
            </div>
          </div>
          <div className="results-outlet">
            <h2>search results</h2>
            {this.displayResults()}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
