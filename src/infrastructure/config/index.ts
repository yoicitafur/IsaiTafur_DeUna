import fs from 'fs';
const jsonFileData = fs.readFileSync(`./conf/${process.env.NODE_ENV as string}.json`);
const config = JSON.parse(jsonFileData.toString());
export default config;
