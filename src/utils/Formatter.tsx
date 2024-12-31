const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const getFormattedDateStr = (date: Date) => {
  if (date) {
    date = new Date(date);
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1; // Months are 0-based
    let day: string | number = date.getDate();

    // Pad single-digit month and day with leading zero
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;

    return `${year}-${month}-${day}`;
  } else {
    return "";
  }
};

const formatNumber = (num: number) => {
  return numberFormatter.format(num);
};

const formatDollar = (num: number) => {
  return currencyFormatter.format(num);
};

const formatPerc = (num: number) => {
  return percentFormatter.format(num);
};

const formatDate = (date: Date) => {
  if (date) {
    if (typeof date === "number") {
      date = new Date(date);
    }
    return (
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
  } else {
    return "";
  }
};

const formatDatetime = (date: Date) => {
  if (date) {
    date = new Date(date);
    return date.toLocaleString();
  } else {
    return "";
  }
};

const formatter = {
  getFormattedDateStr,
  formatNumber,
  formatDollar,
  formatPerc,
  formatDate,
  formatDatetime,
};

export default formatter;
