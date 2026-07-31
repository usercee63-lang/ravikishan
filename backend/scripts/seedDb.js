require("dotenv").config();

const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const logger = require("../utils/logger");
const Subject = require("../models/Subject");
const StudyMaterial = require("../models/StudyMaterial");

const DATA_DIR = path.join(__dirname, "..", "data copy");

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.name.endsWith(".json")) {
      files.push(full);
    }
  }

  return files;
}

async function seedNavigation() {
  const navDir = path.join(DATA_DIR, "navigation");
  const navFiles = fs
    .readdirSync(navDir)
    .filter((file) => file.endsWith(".json"));

  const ops = navFiles.map((file) => {
    const nav = JSON.parse(fs.readFileSync(path.join(navDir, file), "utf8"));
    const id = path.basename(file, ".json");

    return {
      updateOne: {
        filter: { id },
        update: {
          $set: {
            name: nav.name,
            chapters: nav.chapters,
          },
        },
        upsert: true,
      },
    };
  });

  if (ops.length === 0) {
    return 0;
  }

  const result = await Subject.bulkWrite(ops);

  return result.upsertedCount + result.modifiedCount;
}

async function seedContent() {
  const contentRoot = path.join(DATA_DIR, "content");

  if (!fs.existsSync(contentRoot)) {
    logger.warn("Content directory not found", { contentRoot });
    return { upserted: 0, skipped: 0 };
  }

  const files = walk(contentRoot);
  const ops = [];
  let skipped = 0;

  for (const file of files) {
    const rel = path.relative(contentRoot, file).split(path.sep);

    if (rel.length < 3) {
      logger.warn("Unexpected content file layout, skipping", { file });
      skipped += 1;
      continue;
    }

    const subject = rel[0];
    const chapter = rel[1];
    const topic = path.basename(file, ".json");

    let json;

    try {
      json = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
      logger.warn("Skipping unparseable content file", {
        file,
        message: err.message,
      });
      skipped += 1;
      continue;
    }

    ops.push({
      updateOne: {
        filter: { subject, chapter, topic },
        update: {
          $set: {
            title: json.title || topic,
            data: json,
          },
        },
        upsert: true,
      },
    });
  }

  if (ops.length === 0) {
    return { upserted: 0, skipped };
  }

  const result = await StudyMaterial.bulkWrite(ops);

  return {
    upserted: result.upsertedCount + result.modifiedCount,
    skipped,
  };
}

async function seed() {
  logger.info("Connecting to MongoDB...");

  await connectDB();

  const navCount = await seedNavigation();
  const contentResult = await seedContent();

  logger.info("Seed complete", {
    navigationDocuments: navCount,
    contentDocuments: contentResult.upserted,
    skippedFiles: contentResult.skipped,
    database: mongoose.connection.name,
  });

  await mongoose.connection.close();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error("Seeding failed", { message: err.message, stack: err.stack });
    process.exit(1);
  });
