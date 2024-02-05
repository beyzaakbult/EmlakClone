import React, { useState } from "react";
import { useGet } from "../../hooks";
import { DataView } from 'primereact/dataview';
import { ProgressSpinner } from "primereact/progressspinner";
import { HorizontalCard } from "../card/card";
import { useLocation } from "react-router";
import { ContentSearch} from "../search/search";

const Catalog = ({params}) => {
    const location = useLocation();
    const locationParams = location?.state?.params || {};
    const limit = 10;
    const [indexParams, setIndexParams] = useState({...params, skip: 0, limit: limit, ...locationParams})
    const [data, loading] = useGet(indexParams)
    const itemTemplate = (item) => {
        return (
            <div className="col-12">
                <div className="px-2 py-4 h-full">
                    <HorizontalCard item={item} />
                </div>
            </div>
        )
    }
    return (
        <div className="flex justify-content-center mb-8">
            <div className="w-full" style={{maxWidth:"950px"}}>
                <DataView
                    className="w-full"
                    value={data?.results || []}
                    itemTemplate={itemTemplate}
                    paginator
                    paginatorPosition={data?.totalResults > limit ? "both" : "top"}
                    // header={header}
                    rows={limit}
                    first={indexParams?.skip || 0}
                    lazy 
                    totalRecords={data?.totalResults}
                    pageLinkSize={3}
                    onPage={(e)=>setIndexParams({...indexParams, skip:e.first })}
                    paginatorRight={
                        <ContentSearch 
                            searchParams={indexParams}
                            onSearch={(params) => setIndexParams({...params, skip:0})}
                            placeholder={
                                params?.content === "haber" ? 
                                "Başlık, içerik..." :
                                "İl, ilçe, mahalle, sokak..."
                            }
                        />
                    }
                    paginatorLeft={`${data?.totalResults} ${indexParams?.content?indexParams.content: ''}`}
                    emptyMessage={
                        <div className="p-6 bg-white w-full">
                            {loading ? 
                                <ProgressSpinner/> : 
                                `No results${indexParams?.q?` for "${indexParams.q}"`:null}`//.
                            }
                        </div>
                    }
                />
            </div>
        </div>
    )
}
export { Catalog }