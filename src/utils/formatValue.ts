const formatValue = (value: number): string =>
  Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('pt-BR').format(date);

export default formatValue;
