export interface UnverifiedUserProps {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  trialToActivate?: string;
  formType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UnverifiedUser {
  public readonly id: string;
  public email: string;
  public firstName?: string;
  public lastName?: string;
  public trialToActivate?: string;
  public formType?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: UnverifiedUserProps) {
    this.id = props.id;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.trialToActivate = props.trialToActivate;
    this.formType = props.formType;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: UnverifiedUserProps): UnverifiedUser {
    let trialToActivate = props.trialToActivate;
    let formType = props.formType;

    formType = formType && formType.split("_").join("-");
    if (formType && formType.includes("trial")) {
      trialToActivate = formType.split("-trial").join("");
    }

    return new UnverifiedUser({
      ...props,
      formType,
      trialToActivate,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}