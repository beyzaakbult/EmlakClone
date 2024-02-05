import { MainVıew } from "../layout/mainview"
import { Catalog } from "../components/catalog/catalog"
import { DocumentView } from "../components/document/document"

export const MAINMENU = [
    {
        url: "/",
        label: "Emlakjetski",
        icon: "pi pi-home",
        comp: MainVıew,
    },
    {
        label: "Satılık",
        items: [
            {
                url: "/satilik-konut",
                label: "Konut",
                comp: Catalog,
                params: {
                    content: "ilan",
                    template: "konut",
                    deal: "satilik"
                }
            }, 
            {
                url: "/satilik-isyeri",
                label: "İşyeri",
                comp: Catalog,
                params: {
                    content: "ilan",
                    template: "isyeri",
                    deal: "satilik"
                }
            },
            {
                url: "/satilik-arsa",
                label: "Arsa",
                comp: Catalog,
                params: {
                    content: "ilan",
                    template: "arsa",
                    deal: "satilik"
                }
            }
        ]
    },
    {
        label: "Kiralık",
        items: [
            {
                url: "/kiralik-konut",
                label: "Konut",
                comp: Catalog,
                params: {
                    content: "ilan",
                    template: "konut",
                    deal: "kiralik"
                }
            },
            {
                url: "/kiralik-isyeri",
                label: "İşyeri",
                comp: Catalog,
                params: {
                    content: "ilan",
                    template: "isyeri",
                    deal: "kiralik"
                }
            },
            {
                url: "/kiralik-arsa",
                label: "Arsa",
                comp: Catalog,
                params: {
                    content: "ilan",
                    template: "arsa",
                    deal: "kiralik"
                }
            }
        ]
    },
    {
        url: "/haber",
        label: "Emlak Haberleri",
        comp: Catalog,
        params: {
            content: "haber",
        }
    }
]

const ADDITIONALROUTES = [
    {
        url: "/search",
        label: "Arama",
        comp: Catalog,
    },
    {
        url: "/document/:id",
        label: "Döküman",
        comp: DocumentView,
    },
]

export const getRoutes = () => {
    return [...MAINMENU, ...ADDITIONALROUTES].reduce((routes, menuItem) => {
        const handleMenuItem = (item) => {
            let itemRoutes = []
            const { url, comp, items, params} = item;
            if (url && comp) {
                let newRoute = {
                    url: url,
                    comp: comp
                }
                if (params) newRoute.params = params
                itemRoutes.push(newRoute)
            }
            if (items?.length) {
                items.forEach(childItem => {
                    itemRoutes = [...itemRoutes, ...handleMenuItem(childItem)]
                });
            }
            return itemRoutes
        }
        return [...routes, ...handleMenuItem(menuItem)]
    },[])
}