const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');
const fs = require('fs');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the specific URL
  const url = 'https://www.easynepalityping.com/nepali-baby-name';
  await page.goto(url);

  // Find all buttons in the div class="btn-group"
  const buttons = await page.$$('.btn-group button');

  console.log(`Found ${buttons.length} buttons. Clicking through...`);

  let tableIndex = 0;

  // Iterate through each button, click, and extract tables
  for (const button of buttons) {
    // Click the button
    await button.click();
    
    // Wait for the table to load after the button click using setTimeout
    await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust if needed for page responsiveness

    // Extract all table data on the page
    const tables = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('table')).map((table) => {
        const rows = Array.from(table.querySelectorAll('tr'));
        return rows.map(row => {
          const columns = Array.from(row.querySelectorAll('td, th'));
          return columns.map(column => column.innerText.trim());
        });
      });
    });

    // Output extracted data to text files
    tables.forEach((tableData, index) => {
      const suffix = `${tableIndex + 1}-${index + 1}`;
      const filename = `output-${suffix}.txt`;
      const fileContent = tableData.map(row => row.join('\t')).join('\n');
      
      // Write to file
      fs.writeFileSync(filename, fileContent);
      console.log(`Table data written to ${filename}`);
    });

    tableIndex++;
  }

  // Close the browser
  await browser.close();
})();
