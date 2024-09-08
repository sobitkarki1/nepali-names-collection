const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to the webpage
  await page.goto('https://www.easynepalityping.com/nepali-baby-name'); // Replace with the URL of your choice

  // Extract table data
  const tableData = await page.evaluate(() => {
    const table = document.querySelector('table'); // Replace with the specific table selector if needed
    const rows = Array.from(table.querySelectorAll('tr'));
    
    return rows.map(row => {
      const columns = Array.from(row.querySelectorAll('td, th'));
      return columns.map(column => column.innerText.trim());
    });
  });

  // Print the extracted table data
  console.log(tableData);

  // Close the browser
  await browser.close();
})();

