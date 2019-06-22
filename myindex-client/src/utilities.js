//actual business logic functions

/**
 * get the first dewey decimal category into which an item falls (not used)
 * 
 * @param {string} dewey dewey decimal for which to find a category
 * @param {array} categoryIdList sorted array of string dewey decimal categories
 * @returns {string} first category into which an item falls, or an empty string if it doesn't fall anywhere
 */
export function getOneCategory(dewey, categoryIdList) {
  for (let i of categoryIdList) {
    if (i[0] === dewey[0]) return i;
  }
  return '';
}

/**
 * get up to 3 dewey decimal categories into which an item falls
 * 
 * @param {string} dewey dewey decimal for which to find a category
 * @param {array} categoryIdList sorted array of string dewey decimal categories
 * @returns {array} array of strings of category IDs into which an item falls
 */
export function getAllCategories(dewey, categoryIdList) {
  var categories = [];
  var i = "000";
  for (let cnt = 0; i < dewey; cnt++) {
    i = categoryIdList[cnt];

    //check the first three characters
    if (i[0] === dewey[0]) {
      if (i[1] === "0" && i[2] === "0")
        categories.push(i);
      else if (i[1] === dewey[1] && i[2] === "0")
        categories.push(i);
      else if (i[1] === dewey[1] && i[2] === dewey[2])
        categories.push(i);
    }
  }
  return categories;
}

/** 
 * get total pages and details for each dewey decimal category
 * 
 * @param {array} reads list of read items
 * @param {object} categories hash of category numbers and names
 * @returns {array} [totalPages, detailPageCounts]
 * 
 */
export function getPageCounts(reads, categories) {
  var categoryIdList = Object.keys(categories).sort();
  var totalPages = 0;
  var detailPageCounts = {};

  for (let read of reads) {
    totalPages += pagesToCount(read);

    var itemCategories = getAllCategories(read.dewey, categoryIdList);

    for (let category of itemCategories) {
      if (detailPageCounts[category]) //if there are already pages in the category
        detailPageCounts[category] += pagesToCount(read);
      else
        detailPageCounts[category] = pagesToCount(read);
    }
  }
  return [totalPages, detailPageCounts];
}

/**
 * determine how many pages to count
 * 
 * @param {Object} read read item
 * @returns {number} number of pages to count
 */
function pagesToCount(read) {
  if (read.read === "Fully") return Number(read.pages);
  if (read.read === "Partially") return Number(read.pages / 2);
  else return 0;
}

/**
 * send/receive data from backend
 * 
 * @param {string} endpoint 
 * @param {object} data 
 */
export async function fetcher(endpoint, data) {
  return new Promise((resolve, reject) => {
    fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then((r) => r.json()).then((r) => resolve(r))
      .catch((e) => console.log(e));
  });
}