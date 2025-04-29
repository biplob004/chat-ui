// constants.ts
export interface Message {
  id: string;
  content: string;
  isSentByUser: boolean;
  fileUrls?: string[];  
  fileNames?: string[]; 
  avatarUrl?: string;
}

export interface ChatMessageProps {
  message: string;
  isSentByUser: boolean;
  fileUrls?: string[];  
  fileNames?: string[]; 
  avatarUrl?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateDashboardMessage(data: any, mode: string) {
  const { active_deals, less_than_2_days_deals, closed_deals } = data;
  const isDarkMode = mode === 'dark';

  // Define colors for dark and light modes
  const circleBackground = isDarkMode ? '#444' : '#ddd';
  const textColor = isDarkMode ? '#fff' : '#000';
  const containerBackground = isDarkMode ? '#333' : '#fff';

  return `<div style="
    display: flex;
    justify-content: center;
    gap: 40px;
    text-align: center;
    margin: 30px;
    background: ${containerBackground};
    padding: 20px;
    border-radius: 8px;
    font-family: var(--font-geist-sans), sans-serif;
  ">
  <!-- Active Deals -->
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="
      width: 80px;
      height: 80px;
      background: ${circleBackground};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight:400;
      color: ${textColor};
    ">${active_deals}
    </div>
    <span style="margin-top: 5px; color: ${textColor};">Active deals</span>
  </div>

  <!-- <2 Days Deals -->
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="
      width: 80px;
      height: 80px;
      background: ${circleBackground};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight:400;
      color: ${textColor};
    ">${less_than_2_days_deals}
    </div>
    <span style="margin-top: 5px; color: ${textColor};">&lt;2 days deals</span>
  </div>

  <!-- Closed Deals -->
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="
      width: 80px;
      height: 80px;
      background: ${circleBackground};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight:400;
      color: ${textColor};
    ">${closed_deals}
    </div>
    <span style="margin-top: 5px; color: ${textColor};">Closed deals</span>
  </div>
</div>`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateStatusTable(input: any) {
  // Allow for the input to either be an array or an object with a "data" property.
  const rows = input.data || input;

  // Define the columns (headers)
  const columns = [
    "Received earnest $",
    "Contingency removed",
    "Appraisal received",
    "Loan approved",
    "Buyer walkthrough",
    "Loan Funded",
    "Project closed",
  ];

  // Start building the HTML string
  let html = `<table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; font-family: var(--font-geist-sans), sans-serif; ">
      <thead>
        <tr >
          <th>ID</th>
          ${columns.map(col => `<th className="px-4 py-2 text-center font-medium">${col}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
  `;

  // Create a row for each item in the rows array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows.forEach((row: any) => {
    html += `<tr>`;
    html += `<td>${row.id}</td>`; // First cell shows the ID

    // Loop over each column index to guarantee 7 cells per row.
    for (let i = 0; i < columns.length; i++) {
      // If row.values is missing a value at this index, default to an empty string.
      const val = row.values[i] || "";
      html += `<td style="background-color: ${val}; border: 1px solid #ccc;"></td>`;
      
    } 
    html += `</tr>`;
  });

  html += `
      </tbody>
</table>`;

  // Additional logic based on 'mode' can be added here if needed.
  return html;
}

