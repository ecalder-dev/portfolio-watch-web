let numberFormatter = new Intl.NumberFormat('en-US');

let currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

let percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

let dateFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

class Formatter {

  public static formatNumber(num: number) {
    return numberFormatter.format(num);
  }

  public static formatDollar(num: number) {
    return currencyFormatter.format(num);
  }

  public static formatPerc(num: number) {
    return percentFormatter.format(num);
  }

  public static formatDate(date: Date) {
    if (date) {
      if (typeof date === 'number') {
        date = new Date(date);
      }
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    } else {
      return '';
    }
  }
}

export default Formatter;
