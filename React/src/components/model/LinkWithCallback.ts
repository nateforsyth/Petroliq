import ILinkWithCallback from "../../interfaces/ILinkWithCallback";
import { Link } from "./Link";

export class LinkWithCallback extends Link implements ILinkWithCallback {
    callback: any;
    isLink: boolean;
    hide?: boolean | undefined;

    constructor(label: string, link: string, callback: any, isLink: boolean, hide?: boolean | undefined) {
        super(label, link);
        
        this.callback = callback;
        this.isLink = isLink;
        this.hide = hide;
    }
}
