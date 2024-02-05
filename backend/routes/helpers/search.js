const applySearch = (items, searchKeys) => {
    if (searchKeys?.length) {
        let ranked = items.reduce((results, item) => {
            let exactMatchRank = 0;
            searchKeys.forEach(key => {
              exactMatchRank += Object.entries(item)
                .filter(([k,v]) => 
                  `${v}`.toLowerCase() === key
                )
                .reduce((rank, [k,v]) => 
                  rank + (
                    k === "name" ? 32 :
                    k === "address" ? 8 : 2
                  ), 0
                )
            })
            let partialMatchRank = 0;
            searchKeys.forEach(key => {
              partialMatchRank += Object.entries(item)
                .filter(([k,v]) => 
                  `${v}`.toLowerCase() !== key && 
                  `${v}`.toLowerCase().includes(key)
                )
                .reduce((rank, [k,v]) => 
                  rank + (
                    k === "name" ? 32 :
                    k === "address" ? 4 : 1
                  ), 0
                )
            })
            const totalRank = exactMatchRank + partialMatchRank;
            if (totalRank > 0) {
                return [...results, {
                    rank: totalRank,
                    data: item
                }]
            }
            else return results
        },[])
      ranked.sort((a, b) => b.rank - a.rank)
      return ranked.map((item) => item.data)
    }
    else return items
}

module.exports = { applySearch }