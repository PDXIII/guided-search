import axios from "axios";
import _ from "lodash";

const url = "http://beta.json-generator.com/api/json/get/4kUm-4IdX";

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
