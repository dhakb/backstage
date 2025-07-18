export interface UserProps {
  id?: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  stripeCustomerId?: string;
  keygenUserId?: string;
  companyName?: string;
  vatNumber?: string;
  products?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id?: number;
  public email: string;
  public password: string;
  public firstName?: string;
  public lastName?: string;
  public stripeCustomerId?: string;
  public keygenUserId?: string;
  public companyName?: string;
  public vatNumber?: string;
  public products?: string[];
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.stripeCustomerId = props.stripeCustomerId;
    this.keygenUserId = props.keygenUserId;
    this.companyName = props.companyName;
    this.vatNumber = props.vatNumber;
    this.products = props.products;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}