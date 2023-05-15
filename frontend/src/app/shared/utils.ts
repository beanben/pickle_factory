import { FormGroup } from "@angular/forms";

export function pascalToTitle(pascalCase: string): string {
    const titleCase = pascalCase.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    return titleCase.replace(/\b\w/g, (match) => match.toUpperCase());
}

export function pascalToSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
}

export function toTitleCase(str: string): string {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

export function addSpaceBetweenCapitalLetters(str: string): string {
    const world: string = str.replace(/([A-Z])/g, (match) => ` ${match}`);
    return world.trim();
}

export function snakeToCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  export function toCamelCase(str: string): string {
    return str.replace(/\s(.)/g, (match, char) => char.toUpperCase());
  }

  export function isFormEmpty(form: FormGroup): boolean {
    return Object.values(form.value).every(value => value === null || value === '');
  }