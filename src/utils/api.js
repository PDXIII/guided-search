import axios from "axios";
import _ from "lodash";

const url = "https://beta.json-generator.com/api/json/get/4kUm-4IdX";
// const url = "https://raw.githubusercontent.com/PDXIII/guided-search/master/public/data/data.json";

var sortData = response => ({
  items: response.data,
  filters: generateFilters(response)
});

var generateFilters = response =>
  _.uniqBy(
    response.data.map((item, key) => ({
      id: key,
      name: item.type,
      isActive: false
    })),
    "name"
  );

export default {
  get: axios.get(url).then(sortData).catch(error => console.error(error))
};
