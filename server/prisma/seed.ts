import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"; // 1. Import the adapter
import pg from "pg";
import "dotenv/config";
import fs from "fs";
import path from "path";

// 2. Set up the connection pool and adapter
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function deleteAllData(orderedFileNames: string[]) {
	const modelNames = orderedFileNames.map((fileName) => {
		const modelName = path.basename(fileName, path.extname(fileName));
		return modelName.charAt(0).toUpperCase() + modelName.slice(1);
	});

	for (const modelName of modelNames) {
		const model: any = prisma[modelName as keyof typeof prisma];
		if (model) {
			await model.deleteMany({});
			console.log(`Cleared data from ${modelName}`);
		} else {
			console.error(
				`Model ${modelName} not found. Please ensure the model name is correctly specified.`,
			);
		}
	}
}

async function main() {
	// FIX: Replaced __dirname with modern module syntax
	const dataDirectory = path.join(import.meta.dirname, "seedData");

	const orderedFileNames = [
		"products.json",
		"expenseSummary.json",
		"sales.json",
		"salesSummary.json",
		"purchases.json",
		"purchaseSummary.json",
		"users.json",
		"expenses.json",
		"expenseByCategory.json",
	];

	await deleteAllData(orderedFileNames);

	for (const fileName of orderedFileNames) {
		const filePath = path.join(dataDirectory, fileName);
		const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
		const modelName = path.basename(fileName, path.extname(fileName));
		const model: any = prisma[modelName as keyof typeof prisma];

		if (!model) {
			console.error(`No Prisma model matches the file name: ${fileName}`);
			continue;
		}

		for (const data of jsonData) {
			await model.create({
				data,
			});
		}

		console.log(`Seeded ${modelName} with data from ${fileName}`);
	}
}

main()
	.catch((e) => {
		console.error(e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
