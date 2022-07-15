const { debug } = require("console");
const crypto = require("crypto");

/**
 * This function returns a specific partition key that is going to be cleaned
 * If not specific partition key, then can generate one from the input
 * By default returns '0'
 * 
 * @event {object} Object used to generate the partition key
*/
exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  let candidate = TRIVIAL_PARTITION_KEY;

  if (event?.partitionKey) {
    candidate = event.partitionKey;
    if (typeof candidate !== "string") {
      candidate = JSON.stringify(candidate);
    }
    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
      candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
    }
  } else if(event) {
    const data = JSON.stringify(event);
    candidate = crypto.createHash("sha3-512").update(data).digest("hex");
  }

  return candidate
};