import ILinkWithCallback from "../../interfaces/ILinkWithCallback";
import { Link } from "./Link";

export class LinkWithCallback extends Link implements ILinkWithCallback {
    callback: any;
    hide?: boolean | undefined;

    constructor(label: string, link: string, callback: any, hide?: boolean | undefined) {
        super(label, link);
        
        this.callback = callback;
        this.hide = hide;
    }
}
