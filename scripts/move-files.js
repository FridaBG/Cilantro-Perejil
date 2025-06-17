const {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const BUCKET = "cilantro-vs-perejil";
const SCRAPPED_PREFIX = "dataset/scrapped";
const LOCAL_PREFIX = "dataset/local";
const CLASSES = ["cilantro", "perejil"];
const SPLITS = [
  { name: "train", ratio: 0.6 },
  { name: "validation", ratio: 0.2 },
  { name: "test", ratio: 0.2 },
];

const dotenv = require("dotenv");
dotenv.config();

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function listKeys(prefix) {
  let ContinuationToken;
  let keys = [];
  do {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        ContinuationToken,
      })
    );
    const contents = res.Contents || [];
    keys.push(
      ...contents.map((obj) => obj.Key).filter((key) => !key.endsWith("/"))
    );
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return keys;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function splitList(list, ratios) {
  const n = list.length;
  const nTrain = Math.floor(n * ratios[0]);
  const nVal = Math.floor(n * ratios[1]);
  const nTest = n - nTrain - nVal;
  return [
    list.slice(0, nTrain),
    list.slice(nTrain, nTrain + nVal),
    list.slice(nTrain + nVal),
  ];
}

async function moveObject(src, dest) {
  // Copy
  await s3.send(
    new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${src}`,
      Key: dest,
    })
  );
  // Delete original
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: src,
    })
  );
}

async function processClass(cls) {
  const srcPrefix = `${SCRAPPED_PREFIX}/${cls}/`;
  const dstPrefix = `${LOCAL_PREFIX}/${cls}/`;

  const keys = await listKeys(srcPrefix);
  const shuffled = shuffle(keys);
  const [train, val, test] = splitList(
    shuffled,
    SPLITS.map((s) => s.ratio)
  );

  for (const [splitName, splitKeys] of [
    ["train", train],
    ["validation", val],
    ["test", test],
  ]) {
    for (const srcKey of splitKeys) {
      const fileName = srcKey.split("/").pop();
      const destKey = `${dstPrefix}${splitName}/${fileName}`;
      console.log(`Moving ${srcKey} → ${destKey}`);
      await moveObject(srcKey, destKey);
    }
  }
}

async function main() {
  for (const cls of CLASSES) {
    await processClass(cls);
  }
  console.log("✅ All files moved and split.");
}

main().catch(console.error);
