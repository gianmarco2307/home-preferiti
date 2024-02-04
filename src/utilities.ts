import { Card } from "./interfaces/card";
import { Users } from "./interfaces/users";

const regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/;

export function utilitySetItem(
  value: Card[] | string | Users,
  item?: string
) {
  if (typeof value == "string") {
    localStorage.setItem("email", value);
  } else if (typeof value == "object" && item == "users") {
    localStorage.setItem("users", JSON.stringify(value));
  } else if (typeof value == "object" && item == "cards") {
    localStorage.setItem("cards", JSON.stringify(value));
  } else {
    console.error("Item non previsto");
  }
}

export function utilityEmailValidation(value: string): boolean {
  if (value.match(regex) != null) {
    return true;
  }
  return false;
}

export function utilityFormFieldsValidation(value: string): boolean {
  if (value != "") {
    return true;
  }
  return false;
}
