
export function PascalToTitle(pascalCase: string): string {
    const titleCase = pascalCase.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    return titleCase.replace(/\b\w/g, (match) => match.toUpperCase());
}