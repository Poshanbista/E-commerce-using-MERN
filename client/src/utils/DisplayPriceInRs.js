export const DisplayPriceInRs = (price) => {
    const formattedNumber = new Intl.NumberFormat('en-IN').format(price);
    return `Rs. ${formattedNumber}`;
};
