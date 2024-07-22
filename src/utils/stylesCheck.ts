// Prevents return of an empty HTML class attribute.
export function stylesCheck(styles: string | undefined) {
  if (!styles) return undefined;

  return styles;
}
