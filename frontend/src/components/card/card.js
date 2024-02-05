import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router';
import { Button } from 'primereact/button';

const HorizontalCard = ({item}) => {
    const navigate = useNavigate();
    const conf = item?.template? cardConf?.[item.template] || {} : {}
    const {header=[], tags=[], highlights=[], additional=[]} = conf
    return (
        <div className="flex">
            <div>
                <img src={item?.picture} alt={item.name} style={{minWidth: "200px", width:"100%", height: "150px"}}/>
            </div>
            <div className="py-2 px-3">
                <div>
                    {header.map(key => 
                        <Button 
                            key={key} 
                            className="capitalize mb-2 mt-0 p-0" 
                            link 
                            label={item?.[key]}
                            onClick={()=>navigate(`/document/${item.ID}`,{state:{params:{content:item?.contentType}}})}
                        />)
                    }
                </div>
                {tags.reduce((results, tag, index) => {
                    let tagValue = "";
                    if (tag?.field) tagValue = item[tag.field]
                    if (tag?.getValue) tagValue = tag.getValue(item)
                    if (tagValue) return [...results, <Tag key={index} className="mb-2 mr-2 align-items-center capitalize surface-200 text-900 pt-1 py-0" icon={tag?.icon} value={`${tagValue}`}/>]
                    else return results
                },[])}
                {highlights.reduce((results, highlight, index) => {
                    let highlightValue = "";
                    if (highlight?.field) highlightValue = item[highlight.field]
                    if (highlight?.getValue) highlightValue = highlight.getValue(item)
                    if (highlightValue) return [...results, <h2 key={index} className="capitalize mb-2 mt-0">{highlightValue}</h2>]
                    else return results
                },[])}
                {additional.reduce((results, additionalInfo, index) => {
                    let info = "";
                    if (additionalInfo?.field) info = item[additionalInfo.field]
                    if (additionalInfo?.getValue) info = additionalInfo.getValue(item)
                    if (info) return [...results, <div key={index} className='mb-2'>{info}</div>]
                    else return results
                },[])}
            </div>
        </div>
    )
}

const VerticalCard = ({item}) => {
    const navigate = useNavigate();
    const conf = item?.template? cardConf?.[item.template] || {} : {}
    const header = conf?.header || [] 
    const tags = conf?.tags || []
    const highlights = conf?.highlights || []
    const additional = conf?.additional || []

    return (
        <div className={`border-1 border-gray-300 border-round-md bg-white p-2 h-full`} style={{width:"300px"}}>
            <div className="flex flex-column h-full">
                <div>
                    <div className="mb-2">
                        <img src={item?.picture} alt={item.name} style={{minWidth: "200px", width:"100%", height: "150px"}}/>
                    </div>
                </div>
                <div className="flex-grow-1 flex flex-column justify-content-evenly">
                    <div className="mb-2">
                        {header.map(key => 
                            <Button 
                                key={key} 
                                className="capitalize mb-2 mt-0 p-0" 
                                link 
                                label={item?.[key]}
                                onClick={()=>navigate(`/document/${item.ID}`, {state:{params:{content:item?.contentType}}})}
                            />)
                        }
                    </div>
                    <div className="text-xs">
                        {additional.reduce((results, additionalInfo, index) => {
                            let info = "";
                            if (additionalInfo?.field) info = item[additionalInfo.field]
                            if (additionalInfo?.getValue) info = additionalInfo.getValue(item)
                            if (info) return [...results, <div key={index} className='mb-2'>{info}</div>]
                            else return results
                        },[])}
                    </div>
                </div>
                <div>
                    {tags.reduce((results, tag, index) => {
                        let tagValue = "";
                        if (tag?.field) tagValue = item[tag.field]
                        if (tag?.getValue) tagValue = tag.getValue(item)
                        if (tagValue) return [...results, <Tag key={index} className="mb-2 mr-2 align-items-center capitalize surface-200 text-900 pt-1 py-0" icon={tag?.icon} value={`${tagValue}`}/>]
                        else return results
                    },[])}
                    {highlights.reduce((results, highlight, index) => {
                        let highlightValue = "";
                        if (highlight?.field) highlightValue = item[highlight.field]
                        if (highlight?.getValue) highlightValue = highlight.getValue(item)
                        if (highlightValue) return [...results, <h2 key={index} className="capitalize mb-2 mt-0">{highlightValue}</h2>]
                        else return results
                    },[])}
                </div>
            </div>
        </div>
    )
}

export { HorizontalCard, VerticalCard }

const ilanConf = {
        header: ["name"],
        tags: [
            { getValue: (item)=>{
                const dateTimeValue = new Date(item.lastUpdated);
                const locale = navigator.language;
                return dateTimeValue.toLocaleString(locale, { timeZone: 'UTC', year:"numeric", month:"numeric", day: "numeric" })
            }, icon: "pi pi-calendar" },
            { field: "type", icon: "pi pi-home" },
            { getValue: (item)=>item.template === "arsa" ? null : item?.rooms===1?"Stüdyo":`${item.rooms-1} + 1`, icon: "pi pi-table" },
            { getValue: (item)=>item.template === "arsa" ? null : item.type!=="villa" ? item.floor === 0 ? "Zemin kat" : `${item.floor}. kat` : null, icon: "pi pi-building" },
            { getValue: (item)=>`${item.meterSquare} metrekare`, icon: "pi pi-arrows-h" }
        ],
        highlights: [
            { getValue: (item) => {
                const formatter = new Intl.NumberFormat('tr', {
                    style: 'currency',
                    currency: 'TRY',
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0
                  });
                return formatter.format(item.price)
            }}
        ],
        additional: [{ field: "address" }]
    }

const cardConf = {
    konut: ilanConf,
    isyeri:  ilanConf,
    arsa: ilanConf,
    emlak_haber: {
        header: ["name"],
        tags: [{ getValue: (item)=>{
            const dateTimeValue = new Date(item.published);
            const locale = navigator.language;
            return dateTimeValue.toLocaleString(locale, { timeZone: 'UTC', year:"numeric", month:"numeric", day: "numeric" })
        }, icon: "pi pi-calendar" }],
        additional: [{ getValue: (item) => `${item.summary}...`}],
    }
}