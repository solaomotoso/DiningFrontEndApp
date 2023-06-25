export class Payment {
  id: number;
  dateEntered: Date;
  enteredBy: number;
  custCode: string;
  voucherId: number;
  unit: number;
  Amount: number;
  paymentmodeid: number;

constructor() {
    this.id = 0;
    this.dateEntered = new Date();
    this.enteredBy = 0;
    this.custCode = "";
    this.voucherId = 0;
    this.unit=0;
    this.Amount=0;
    this.paymentmodeid=0;
  }
}
