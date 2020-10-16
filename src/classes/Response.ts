/*
 * File: Response.ts
 * Created: 10/15/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { HTTP_STATUS_CODES } from '../constants';
type statusClasses = "server_error" | "client_error" | "redirection" | "success" | "informational";


export default class Response {

    public codeInfo: {
        label: string,
        description: string
    }

    constructor(
        public code: string,
        public description: string | null,
        public returnType: string | null,
        public errorMessage: string | null
    ) {
        if (errorMessage != null && errorMessage != errorMessage.toUpperCase()) throw new Error(`Invalid error message "${errorMessage}"`);
        if (Object.keys(HTTP_STATUS_CODES).indexOf(code) == -1) throw new Error(`${code} is an invalid status code`);
        // TODO: fix this
        // @ts-ignore
        this.codeInfo = HTTP_STATUS_CODES[code];
    }

    static deserialize(code: string, data: { [key: string]: string }): Response {
        return new Response(
            code,
            data.description || null,
            data.returnType || null,
            data.errorMessage || null
        )
    }

    get isOK(): boolean {
        return this.isStatusClass('success');
    }

    get isError(): boolean {
        return this.isStatusClass('client_error') || this.isStatusClass('server_error');
    }

    serialize(): { [key: string]: any } {
        return {
            description: this.description,
            returnType: this.returnType,
            errorMessage: this.errorMessage
        }
    }

    getStatusClass(): statusClasses {
        const code = parseInt(this.code);
        if (code >= 500) return 'server_error';
        if (code >= 400) return 'client_error';
        if (code >= 300) return 'redirection';
        if (code >= 200) return 'success';
        if (code >= 100) return 'informational';
        throw new Error(`${code} is an invalid status code`);
    }

    isStatusClass(_class: statusClasses): boolean {
        return this.getStatusClass() == _class;
    }


}