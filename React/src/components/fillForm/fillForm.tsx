import * as React from "react";
import FillFormProps from "./fillFormProps";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FillForm: React.FunctionComponent<FillFormProps> = (props) => {

    /*
        date: moment("23/01/2022", "DD/MM/YYYY"),
        spend: 40,
        pricePerLitre: 2.549,
        totalVolume: 17.5,
        discountApplied: 0.06
     */

    const [date, setDate] = React.useState<Date>(new Date());
    const [formData, setFormData] = React.useState({
        spend: 0,
        pricePerLitre: 0,
        totalVolume: 40,
        discountApplied: 0.06,
    });

    const handleChange = (e: any) => {
        if (e.target === null || e.target === undefined) {
            console.log(e);
            setDate(e);
        }
        else {
            const { name, value } = e.target;
            setFormData((prevData: any) => ({
                ...prevData,
                [name]: value,
            }));
        }        
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(`date: ${date}, spend: ${formData.spend}, pricePerLitre: ${formData.pricePerLitre}, totalVolume: ${formData.totalVolume}, discountApplied: ${formData.discountApplied}`);
        // TODO handle form submission
    };

    const formElement: JSX.Element = (
        <form onSubmit={handleSubmit}>
            <label>
                Date:
                <DatePicker
                    selected={date}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Spend:
                <input
                    type="number"
                    name="spend"
                    value={formData.spend}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Price per litre:
                <input
                    type="number"
                    name="pricePerLitre"
                    value={formData.pricePerLitre}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Total volume:
                <input
                    type="number"
                    name="totalVolume"
                    value={formData.totalVolume}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Discount:
                <input
                    type="number"
                    name="discountApplied"
                    value={formData.discountApplied}
                    onChange={handleChange}
                />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
    );

    let htmlElement: JSX.Element = <div>{formElement}</div>;

    return htmlElement;
};

export default FillForm;
