import { Carousel } from 'primereact/carousel';
import { Menubar } from 'primereact/menubar';
import React, { useState } from "react";
import { VerticalCard } from "../components/card/card";
import { IlanSearch } from "../components/search/search";
import { useGet } from "../hooks";
import { MAINMENU } from "../router/routes";
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
// import { Login } from './login';

const MainVıew = () => {
    const navigate = useNavigate();
    const [ilanlar] = useGet({content:"ilan", template:"konut", skip: 0, limit: 99})
    const [haberler] = useGet({content:"haber", template:"emlak_haber", skip: 0, limit: 4})
    const [searchParams, setSearchParams] = useState({ content: "ilan", template: "konut", deal: "satilik" })
    return (
        <div>
            <div
                className="w-full flex justify-content-center align-items-center"
                style={{minWidth: "200px", width:"100%", height: "300px", backgroundImage: "url('http://placehold.it/32x32')"}}
            >
                <IlanSearch 
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    //navigate =  https://reactrouter.com/en/main/hooks/use-navigate
                    onSearch={(params) => navigate("/search", { state: { params: params}})}
                />
            </div>
            <div className="flex justify-content-center mb-8">
                <div className="w-full" style={{maxWidth:"1000px"}}>
                    {ilanlar?.totalResults && 
                      // https://primereact.org/carousel/
                        <Carousel 
                            className="custom-carousel" 
                            value={ilanlar?.results} //.
                            numVisible={3} 
                            numScroll={3} 
                            circular
                            autoplayInterval={5000} 
                            itemTemplate={(item)=><VerticalCard item={item}/>}
                            header={<h2 className="mx-6">Öne çıkan ilanlar</h2>}
                            showIndicators={false}
                        />
                    }
                </div>
            </div>
            <div className="flex justify-content-center mb-8">
                <div className="w-full" style={{maxWidth:"900px"}}>
                    {haberler?.totalResults && 
                        <Carousel 
                            className="custom-carousel" 
                            value={haberler?.results} 
                            numVisible={3}
                            itemTemplate={(item)=><VerticalCard item={item}/>}
                            header={
                                <div className="flex justify-content-between align-items-center">
                                    <h2>Emlak haberleri</h2>
                                    <Button label="Tüm haberler" onClick={() => navigate("/haber")}/>
                                </div>
                            }
                            showNavigators={false}
                            showIndicators={false}
                        />
                    }
                </div>
            </div>
            { /* <div>
                FOOTER 
                </div>*/}       
        </div>
    )
}

const MainMenu = () => {
    // https://primereact.org/menubar/
    return (
        <div className="flex flex-wrap justify-content-between align-items-center">
            <div><Menubar model={MAINMENU} /></div>
            {/* <div className="mr-2"><Login /></div> */}
           
        </div>
    )
}

export { MainMenu, MainVıew }; 