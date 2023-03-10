
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