import { Card } from "./interfaces/card";

export function utilitySetItem(valueCards?: Card[]) {
  if (!!valueCards) {
    localStorage.setItem("cards", JSON.stringify(valueCards));
  }
}

export function utilityFormFieldsValidation(value: string): boolean {
  if (value != "") {
    return true;
  }
  return false;
}
