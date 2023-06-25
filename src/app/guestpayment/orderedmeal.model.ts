export class OrderedMeal {
  id: number;
  guest:string;
  mealid:number;
  enteredBy: string;
  amount:number;
  dateEntered:Date;


constructor() {
    this.id = 0;
    this.guest='';
    this.mealid = 0;
    this.enteredBy='';
    this.amount=0;
    this.dateEntered=new Date;
  }
}
