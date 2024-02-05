import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { useState } from 'react';

const ContentSearch = ({searchParams, onSearch, placeholder = ""}) => {
    const [search, setSearch] = useState('');
    return (
        <div className="flex flex-wrap align-items-cemter flex-grow-1">
            <InputText 
                className="mb-2 flex-grow-1" 
                placeholder={placeholder} 
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
            />
            <Button 
                className="mb-2 flex-grow-1" 
                icon="pi pi-search" 
                label="Ara"
                onClick={() => {
                    const newParams = {...searchParams, q: search || ""};
                    onSearch(newParams)
                }}
            />
        </div>
    )
}

const IlanSearch = ({searchParams, setSearchParams, onSearch}) => {
    return (
        <div>
            <TabView 
                panelContainerClassName="hidden"
                activeIndex={["satilik", "kiralik"].findIndex(val => val === searchParams?.deal)}
                onTabChange={(e)=> setSearchParams({
                    ...searchParams,
                    deal: ["satilik", "kiralik"][e.index]
                })}>
                <TabPanel header="Satılık" />
                <TabPanel header="Kiralık" />
            </TabView>
            <div className="flex flex-wrap align-items-center">
                <Dropdown
                    className="mb-2 flex-grow-1"
                    value={searchParams?.template} 
                    onChange={(e) => setSearchParams({...searchParams, template: e.value})} 
                    options={[
                        { label: "Konut", value: "konut" },
                        { label: "İşyeri", value: "isyeri" },
                        { label: "Arsa", value: "arsa" },
                    ]} 
                    optionLabel="label"
                    style={{width:"120px"}}
                />
                <ContentSearch
                    searchParams={searchParams}
                    onSearch={onSearch}
                    placeholder="İl, ilçe, mahalle, sokak..."
                />
            </div>
        </div>
    )
}
export { ContentSearch, IlanSearch };