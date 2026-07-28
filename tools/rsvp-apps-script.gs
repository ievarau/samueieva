/**
 * RSVP → Google Sheet backend for the wedding site.
 *
 * SETUP:
 * 1. Create a Google Sheet (any name). Add this exact header row on row 1 of the first tab:
 *    Timestamp | Name | Email | Attending Wedding | Attending Hytta | Plus One | Plus One Name | Dietary
 * 2. In that Sheet: Extensions -> Apps Script.
 * 3. Delete any starter code and paste this whole file in.
 * 4. Click Deploy -> New deployment -> select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy, authorize the requested permissions, then copy the "Web app URL".
 * 6. Paste that URL into the RSVP_ENDPOINT constant near the top of src/script.js.
 * 7. Re-run the encrypt-site.html build to redeploy the site with the new endpoint.
 *
 * Every RSVP submission from the site appends one row to this Sheet. To view responses,
 * just open the Sheet — no extra dashboard needed.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Add the header row automatically if the sheet is empty.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Email', 'Attending Wedding', 'Attending Hytta',
      'Plus One', 'Plus One Name', 'Dietary'
    ]);
  }

  var params = (e && e.parameter) ? e.parameter : {};

  sheet.appendRow([
    new Date(),
    params.name || '',
    params.email || '',
    params.attending_wedding || '',
    params.attending_hytta || '',
    params.plus_one || '',
    params.plus_one_name || '',
    params.dietary || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Simple health check so you can confirm the deployment works by visiting the Web app URL directly.
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'RSVP endpoint is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
