const downloadFile = (data: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', data);
    element.setAttribute('download', 'transactions.csv');
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

export { downloadFile };
