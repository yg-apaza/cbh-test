const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  const hash = (data) => {
    return crypto.createHash("sha3-512").update(data).digest("hex");
  };

  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns same key based on 'Specific partition key method' when given a string", () => {
    let event = { partitionKey : "123456789" };
    const specificPartitionKey = deterministicPartitionKey(event);
    expect(specificPartitionKey).toBe("123456789");
  });

  it("Returns JSON string based on 'Specific partition key method' when given a no-string value", () => {
    let event = { partitionKey : { randomNumber: 123456789 } };
    const specificPartitionKey = deterministicPartitionKey(event);
    expect(specificPartitionKey).toBe(JSON.stringify(event.partitionKey));
  });

  it("Returns hash based on 'Specific partition key method' when given a long string", () => {
    let event = { partitionKey : "a".repeat(1000) };
    const specificPartitionKey = deterministicPartitionKey(event);
    expect(specificPartitionKey).toBe(hash(event.partitionKey));
  });

  it("Returns hash based on 'Generated partition key method' when given a Object", () => {
    let event = { whateverKey : 1, whateverRandomKey: "Random string" };
    const generatedPartitionKey = deterministicPartitionKey(event);
    expect(generatedPartitionKey).toBe(hash(JSON.stringify(event)));
  });

  it("Returns hash based on 'Generated partition key method' when given a number", () => {
    let event = 1;
    const generatedPartitionKey = deterministicPartitionKey(event);
    expect(generatedPartitionKey).toBe(hash(JSON.stringify(event)));
  });

});
