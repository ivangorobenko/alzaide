import {buildApp} from "./buildApp";

const port = process.env.PORT || 8082;
const applicationToRun = buildApp();

applicationToRun.listen(port, () => console.log(`Alzaide est up sur le port ${port}`));
