export class TBE
{
    constructor() {
        this.tbeRankings = [];
    }
    id: number;
    tbeNo : string;
    tbeDate : Date;
    fileName: string;
    filePath : string;
    fileSize : number;
    mrpId: number;
    tbeRankings : TBERanking[]
}

export class TBERanking
{
    id: number;
    mrpVendorId : number;
    tbeId : number;
    isQualified: boolean;
    ranking: string;
    description: string;
    vendorName: string;
}