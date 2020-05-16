import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query']

});

//@ts-ignore
prisma.on('query', (e: any) => {
    e.timestamp;
    e.query;
    e.params;
    e.duration;
    e.target;
    console.log(e);
});
const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];

(async () => {
    try {
        console.log("Remove all data.");
        await prisma.client.deleteMany({});
        for (let i = 0; i < data.length; i++) {
            await prisma.client.create({ data: { id: data[i], name: data[i] } });
        }
        console.log("Clients created.");

        console.log(`Retrieve first set of 2 (from start):`);
        const set1 = await prisma.client.findMany({ first: 2 });
        for (let i = 0; i < set1.length; i++) {
            console.log(set1[i].id);
        }

        console.log(`Retrieve second set of 2 (from after ${set1[1].id}):`);
        const set2 = await prisma.client.findMany({ first: 2, after: { id: set1[1].id } });
        for (let i = 0; i < set1.length; i++) {
            console.log(set2[i].id);
        }

        console.log(`Retrieve third set of 2 (from after ${set2[1].id}):`);
        const set3 = await prisma.client.findMany({ first: 2, after: { id: set2[1].id } });
        for (let i = 0; i < set1.length; i++) {
            console.log(set3[i].id);
        }

        console.log(`Retrieve second set of 2 (from before ${set3[1].id}):`);
        const set4 = await prisma.client.findMany({
            first: 2,
            before: { id: set3[0].id },  // Before SET3[0].id - first item of set 3
            orderBy: { id: "desc" }
        });
        for (let i = 0; i < set1.length; i++) {
            console.log(set4[i].id);
        }



        console.log("Done");
    } catch (err) {
        console.log("Error: ", err);
    }
    process.exit();
})();

