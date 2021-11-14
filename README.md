# Conceal Cloud


### Development

Requirements:
- NodeJS (v17 or higher)

Clone repository:
```bash
git clone https://github.com/ConcealNetwork/conceal-cloud
cd conceal-cloud

# optional, checkout specific tag
# git checkout tags/<tag> -b <branch>
```

Install project dependencies:
```bash
npm install
```

Run local development server:
```bash
npm start
```

Build production-ready version:
```bash
npm run build
```

Deploy on development (proper AWS credentials needed):
```bash
npm run aws:dev
```

Default API endpoint can be overwritten by setting `REACT_APP_API_ENDPOINT`
environmental variable:
```bash
export REACT_APP_API_ENDPOINT=http://blah/ && npm run build
```

#### Production

Build and deploy to production (proper AWS credentials needed):
```bash
npm run aws:prod
```
