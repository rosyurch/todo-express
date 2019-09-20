function findMaxId(arr) {
    let maxId = 0;
    for (obj of arr) {
        maxId = maxId > obj.id ? maxId : obj.id;
    }
    return maxId;
}

module.exports = findMaxId;
