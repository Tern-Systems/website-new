import axios, {AxiosRequestConfig} from "axios";

import {Res} from "@/app/types/service";

import {BaseService} from "@/app/services/base.service";
import {ARCode} from "@/app/types/arcode";


interface IARCHService {
    postGenerateQR(moduleColor: string, backgroundColor: string): Promise<Res<{ url: string; id: string }>>;

    postSaveQR(email: string, name: string, mediaId: string, qrFile: File, video: File): Promise<Res>;

    getListQRs(email: string): Promise<Res<ARCode[]>>;
}

class ARCHServiceImpl extends BaseService implements IARCHService {
    constructor() {
        super(ARCHServiceImpl.name)
    }

    async postGenerateQR(moduleColor: string, backgroundColor: string): Promise<Res<{ url: string; id: string }>> {
        this.log(this.postGenerateQR.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `generate-qr`,
            headers: {'Content-Type': 'application/json',},
            data: JSON.stringify({data: 'sample data', moduleColor, backgroundColor}),
            withCredentials: true,
        };

        try {
            const response = await axios(config);
            return {payload: {url: response.data.qrCode, id: response.data.mediaId}};
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error : 'Unknown error!';
        }
    }

    async postSaveQR(email: string, name: string, mediaId: string, qrFile: File, video: File): Promise<Res> {
        this.log(this.postSaveQR.name);

        const formData = new FormData();
        formData.append('user', email);
        formData.append('mediaId', mediaId);
        formData.append('fileName', name);
        formData.append('media', qrFile);
        formData.append('video', video);


        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `save-qr`,
            headers: {'Content-Type': 'multipart/form-data',},
            data: formData,
            withCredentials: true,
        };

        try {
            await axios(config);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error : 'Unknown error!';
        }
    }

    async getListQRs(email: string): Promise<Res<ARCode[]>> {
        this.log(this.getListQRs.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `list-qr-codes`,
            params: {user: email},
            withCredentials: true,
        };

        try {
            const response = await axios(config);
            return {payload: response.data.qrCodes};
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error : 'Unknown error!';
        }
    }
}

const ARCHService = new ARCHServiceImpl();
export {ARCHService};
