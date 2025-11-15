# Vertopal-JS

Vertopal-JS is a JavaScript library for easy access to the
[Vertopal file conversion API](https://www.vertopal.com/en/developer/api).

Using Vertopal-JS, you can quickly integrate support for
converting **350+ file formats** directly into your Node.js or
browser-based projects.

## Installing Vertopal-JS

Vertopal-JS is available on
[npm](https://www.npmjs.com/package/vertopal-js) and can be installed using
[npm](https://www.npmjs.com/):

```bash
npm install vertopal-js
```

If you're not using npm, you can also download the most recent version of
Vertopal-JS source code as a ZIP file from the
[release page](https://github.com/vertopal/vertopal-js/releases/latest) and
import it manually into your project.

## Using Vertopal-JS

## JavaScript Usage

This package includes a public default credential (app: `free`, token:
`FREE-TOKEN`) that lets you quickly experiment without creating an account.
This credential is intended for personal testing and evaluation and comes
with daily rate limits. For production workloads, or if you expect to exceed
the free limits, you should
[obtain a private Application ID and Security Token](https://www.vertopal.com/en/account/api/app/new)
from your Vertopal account and configure them for full access.

The following code illustrates
[GIF to APNG](https://www.vertopal.com/en/convert/gif-to-apng) conversion using
the Vertopal JavaScript library.

```javascript
// Import Vertopal classes
import { Credential, Converter } from 'vertopal';
import { FileInput, FileOutput } from 'vertopal/io';

// Create a client credential instance using your app ID and security token
const app = "free";
const token = "FREE-TOKEN";
const credential = new Credential(app, token);

/**
 * Initialize input and output file streams
 * 
 * Node.js-compatible file I/O:
 * - `FileInput` reads from a local file path (e.g., "./MickeyMouse.gif")
 * - `FileOutput` writes to a local file path (e.g., "./MickeyMouse.apng")
 * 
 * Browser-compatible file I/O:
 * - `BrowserFileInput` reads from browser sources (e.g., <input type="file"> or drag-and-drop)
 * - `BrowserFileOutput` writes to browser sinks (e.g., triggering a download or streaming to canvas)
 */
const source = new FileInput("./MickeyMouse.gif");
const sink = new FileOutput("./MickeyMouse.apng");

// Convert and download your file using the Converter class
(async () => {
  const converter = new Converter(credential);
  const conversion = await converter.convert(source, sink, "apng");
  await conversion.wait();
  if (conversion.successful()) {
    await conversion.download();
  }
})();
```
