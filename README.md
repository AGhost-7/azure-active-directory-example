# Azure Active Directory Integration
Example app which integrates with Azure Active Directory.

Requisites:
- azure account with active directory enabled.
- [ngrok](https://ngrok.com/).

## Getting Started
Install dependencies:
```bash
yarn
```

Create a new application under "App registrations".

Set the following environment variables:
- `CLIENT_ID`: Can be found in the app's overview.
- `TENANT_ID`: Same as above.
- `CLIENT_SECRET`: Active directory section for your app, click "Certificates
& secrets", and create a new client secret.

Navigate to the "API permissions", and add "Group.Read.All" permission
(delegated).

Start ngrok, and grab the https url (e.g., `https://123.ngrok.io`) and append
`/authenticate/openid/return`. This will be your redirect URL. Set it as the
value for the `REDIRECT_URL` environment variable. You will also need to add
this to the "Authentication" section in the azure app registration.

Run `yarn dev`.
