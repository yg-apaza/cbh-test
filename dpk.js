const crypto = require("crypto");

/**
 * Generate a string hash using SHA-3 512 algorithm based on some data
 * @param {String} data 
 * @returns 
 */
const generateHash = (data) => {
  return crypto.createHash("sha3-512").update(data).digest("hex");
}

/**
 * This function returns a specific partition key that is going to be cleaned
 * If not specific partition key, then can generate one from the input
 * By default returns '0'
 * 
 * @param {Object} event Used to generate the partition key
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
      candidate = generateHash(candidate);
    }
  } else if(event) {
    const data = JSON.stringify(event);
    candidate = generateHash(data);
  }

  return candidate
};