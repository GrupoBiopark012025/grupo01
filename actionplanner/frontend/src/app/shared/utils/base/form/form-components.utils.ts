export const generateValidHtmlId = (str: string) => (
  str
    .normalize('NFD') // Normalize the string to decompose diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove the diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9-_:.]+/g, '') // Remove invalid characters
    .replace(/^\d+/, '') // Ensure it doesn't start with a digit
    .replace(/ /g, '_') // Replace spaces with underscores
  + (Math.floor(Math.random() * 100) + 1)
)
