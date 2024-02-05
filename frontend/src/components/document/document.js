import { useLocation, useNavigate } from "react-router"
import { useGet } from "../../hooks"
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { ProgressSpinner } from "primereact/progressspinner";


const DocumentView = ({ id }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const documentId = id || location?.pathname?.split("document/")?.[1];
    let params = {
        ...documentId ? { ID: documentId } : {},
        ...location?.state?.params
    }
    const [data, loading] = useGet(params);
    const currentDocument = data?.results?.[0]
    if (loading) {
        return (
            <div className="w-full p-0 text-center">
                <ProgressSpinner/>
            </div>
        )
    }
    if (!documentId || !currentDocument ||  `${currentDocument?.ID}`!== `${documentId}` ) return (
        <Message 
            className="p-8 w-full text-center" 
            severity="warn"
            content={
                <div>
                    <h3>Döküman mevcut değil</h3>
                    <Button label="Anasayfaya geri dön" severity="warning" onClick={() => navigate("/")}/>
                </div>
            }
        />
    )
    const sections = documentConf?.[currentDocument.template]?.sections || []
    return (
        <div className="w-full flex justify-content-center mb-8 pb-8">
            <div style={{maxWidth:"950px"}}>
                <h1 className="capitalize">{currentDocument?.name || `Döküman #${documentId}`}</h1>
                {currentDocument?.picture &&
                    <img className="w-full mb-2" src={currentDocument?.picture} alt={currentDocument?.name} style={{ maxHeight: "350px"}}/>
                }
                {sections?.map((section,index) => {
                    return (
                        <div key={index}>
                            {section?.label && <h3>{section.label}</h3>}
                            {section?.values?.map(({field}, i) => {
                                const value = currentDocument?.[field];
                                return (
                                    value ? <div key={i} className="mb-2">{value}</div> : null
                                )
                            })}
                            {section?.rows?.length > 0 &&
                                <table className="mb-2">
                                    <tbody>
                                        {section?.rows?.reduce((allRows, row, i) => {
                                            const value = row?.getValue && row.getValue(currentDocument)
                                            if (value) {
                                                return [
                                                    ...allRows,
                                                    <tr key={i}>
                                                        <td style={{ width: "150px"}}>{row?.label}</td>
                                                        <td className="px-2">:</td>
                                                        <td>{value}</td>
                                                    </tr>
                                                ]
                                            }
                                            else return allRows
                                        }, [])}
                                    </tbody>
                                </table>
                            }
                        </div>
                    )
                })}
            </div>
            
        </div>
    )
}
export { DocumentView }

const ilanConf = {
    sections: [
        {
            label: "Hakkında",
            values: [{ field: "about" }]
        },
        {
            label: "İlan bilgileri",
            rows: [
                { label: "İlan numarası", getValue: (item) => <div>{item?.ID}</div>},
                { label: "İlan Güncelleme Tarihi", getValue: (item) => {
                    const dateTimeValue = new Date(item.lastUpdated);
                    const locale = navigator.language;
                    return dateTimeValue.toLocaleString(locale, { 
                        timeZone: 'UTC', 
                        year:"numeric", 
                        month:"numeric", 
                        day: "numeric", 
                        hour: "2-digit", 
                        minute:"2-digit", 
                        hour12: false 
                    })
                }},
                { label: "Kategori", getValue: (item) => <div className="capitalize">{item?.deal}</div>},
                { label: "Ücret", getValue: (item) => {
                    const formatter = new Intl.NumberFormat('tr', {
                        style: 'currency',
                        currency: 'TRY',
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 0
                      });
                    return `${formatter.format(item.price)}${item.deal === "kiralik" ? " (Aylık)":""}`
                }},
                { label: "Türü", getValue: (item) => <div className="capitalize">{item?.template}</div>},
                { label: "Tipi", getValue: (item) => <div className="capitalize">{item?.type}</div> },
                { label: "Net Metrekare", getValue: (item) => `${item?.meterSquare} M2` },
                { label: "Oda sayısı", getValue: (item) => 
                    item.template === "arsa" ? null : item?.rooms===1 ? "Stüdyo" : item.template === "isyeri" ? item.rooms : `${item.rooms-1} + 1`
                },
                { label: "Bulunduğu kat", getValue: (item) => 
                    !(item.template === "konut" && item.type === "villa") && item.template !== "arsa" && !(item.template === "isyeri" && ["dükkan", "atölye"].includes(item.type)) ? 
                        item.floor === 0 ? "Zemin kat" : `${item.floor}. kat` : null 
                },
            ]
        },
        {
            label: "Lokasyon",
            rows: [
                { label: "Vilayet", getValue: (item) => <div>{item?.state}</div>},
                { label: "Semt", getValue: (item) => <div>{item?.city}</div>},
                { label: "Sokak Adı", getValue: (item) => <div>{item?.streetName}</div>},
                { label: "Sokak Numarası", getValue: (item) => <div>{item?.streetNumber}</div>}
            ]
        },
        {
            label: "İletişim",
            rows: [
                { label: "Name", getValue: (item) => item?.contactName },
                { label: "Email", getValue: (item) => item?.contactEmail },
                { label: "Phone", getValue: (item) => item?.contactPhone }
            ]
        }
    ],
}

const documentConf = {
    konut: ilanConf,
    isyeri:  ilanConf,
    arsa: ilanConf,
    emlak_haber: {
        sections: [
            {
                rows: [
                    { label: "Yayın tarihi", getValue: (item) => {
                        const dateTimeValue = new Date(item.published);
                        const locale = navigator.language;
                        return dateTimeValue.toLocaleString(locale, { 
                            timeZone: 'UTC', 
                            year:"numeric", 
                            month:"numeric", 
                            day: "numeric", 
                            hour: "2-digit", 
                            minute:"2-digit", 
                            hour12: false 
                        })
                    }}
                ]
            },
            {
                values: [{ field: "summary" }, { field: "article" }]
            }
        ]
    }
}