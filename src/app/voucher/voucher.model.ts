export class Voucher {
  id: number;
  description: string;
  amount: number;
  custtypeid: number;
  custname:string;

constructor() {
    this.id = 0;
    this.description = "";
    this.amount = 0;
    this.custtypeid = 0;
    this.custname="";
  }
}
