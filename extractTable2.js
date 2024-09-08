const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to the webpage
  await page.goto('https://www.easynepalityping.com/nepali-baby-name'); // Replace with the URL of your choice

  // Get all table elements and their summaries
  const tables = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table')).map((table, index) => {
      const caption = table.querySelector('caption')?.innerText || `Table ${index + 1}`;
      return { index, caption };
    });
  });

  // Display available tables
  console.log("Available tables:");
  tables.forEach(table => {
    console.log(`${table.index + 1}: ${table.caption}`);
  });

  // Prompt user to select a table
  const tableIndex = readlineSync.questionInt(`Select a table (1-${tables.length}): `) - 1;

  if (tableIndex < 0 || tableIndex >= tables.length) {
    console.log("Invalid selection. Exiting...");
    await browser.close();
    return;
  }

  // Extract data from the selected table
  const tableData = await page.evaluate((tableIndex) => {
    const table = document.querySelectorAll('table')[tableIndex];
    const rows = Array.from(table.querySelectorAll('tr'));
    
    return rows.map(row => {
      const columns = Array.from(row.querySelectorAll('td, th'));
      return columns.map(column => column.innerText.trim());
    });
  }, tableIndex);

  // Display the extracted table data
  console.log(`\nExtracted data from ${tables[tableIndex].caption}:`);
  console.table(tableData);

  // Close the browser
  await browser.close();
})();
