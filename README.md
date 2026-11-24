# Shree Sai Office – Frontend only (React + Vite)

No backend and no database are needed. All data is stored in the browser (localStorage).

## Run
```bash
npm install
npm run dev        # open http://localhost:5173
```
Build static files (upload the `dist` folder to any web host):
```bash
npm run build
```

## Login
| User | Password |
|---|---|
| admin | ChangeMe123! |
| staff | StaffChange123! |

## Notes
* Data is saved only in this browser, is not shared between devices, and is lost if browser data is cleared.
* Excel export gives a CSV file; Backup gives a JSON file; attachments are kept up to 2 MB.
* Do not use for real customer data. A red "DEMO MODE" bar is always shown.
* To connect a real backend later, delete the `.env` file (or set `VITE_MOCK=false`) and proxy `/api` to your server.
