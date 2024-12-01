const numberFormatter = new Intl.NumberFormat('en-US');

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const getFormattedDateStr = (date: Date) => {
  if (date) {
    date = new Date(date);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  } else {
    return '';
  }
}

const formatNumber = (num: number) => {
  return numberFormatter.format(num);
}

const formatDollar = (num: number) => {
  return currencyFormatter.format(num);
}

const formatPerc = (num: number) => {
  return percentFormatter.format(num);
}

const formatDate = (date: Date) => {
  if (date) {
    if (typeof date === 'number') {
      date = new Date(date);
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  } else {
    return '';
  }
}

const formatDatetime = (date: Date) => {
  if (date) {
    date = new Date(date);
    return date.toLocaleString();
  } else {
    return '';
  }
}

const formatter = {
  getFormattedDateStr,
  formatNumber,
  formatDollar,
  formatPerc,
  formatDate,
  formatDatetime
}

export default formatter;
