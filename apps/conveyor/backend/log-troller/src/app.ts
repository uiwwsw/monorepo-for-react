import { Service } from './service';

async function main() {
    await Service.Inst.ready();
}

main();
