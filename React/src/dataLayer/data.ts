import moment from "moment";
import IFill from "../components/model/interfaces/IFill";

let fills: IFill[] = [
    {
        index: 0,
        date: moment("23/01/2022", "DD/MM/YYYY"),
        spend: 40,
        pricePerLitre: 2.549,
        totalVolume: 17.5,
        discountApplied: 0.06
    },
    {
        index: 1,
        date: moment("30/01/2022", "DD/MM/YYYY"),
        spend: 40,
        pricePerLitre: 2.655,
        totalVolume: 16.2,
        discountApplied: 0.06
    },
    {
        index: 2,
        date: moment("06/01/2022", "DD/MM/YYYY"),
        spend: 40,
        pricePerLitre: 2.998,
        totalVolume: 13.5,
        discountApplied: 0.10
    },
    {
        index: 3,
        date: moment("13/01/2022", "DD/MM/YYYY"),
        spend: 40,
        pricePerLitre: 2.339,
        totalVolume: 18.5,
        discountApplied: 0.06
    }    
]

export default function getFills(): IFill[] {
    return fills;
}

export function getFill(index: number): IFill | undefined {
    return fills.find(
        fill => fill.index === index
    );
}
