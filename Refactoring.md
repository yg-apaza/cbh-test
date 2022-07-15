# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

### Understanding the current code

My first approach was to understand what the current code is trying to do, so that any further improvement should not break the current behavior. I put some comments here explaining the **first version** of the code, the **final version** improved is on [`dpk.js`](dpk.js):

```js
const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  if (event) {
    if (event.partitionKey) {
      /** Specific partition key method
       * Depending on the input, here candidate can be a string or
       * any other type of object
      */
      candidate = event.partitionKey;
    } else {
      /** Generated partition key method
       * If there is not event.partitionKey then it's going to create a
       * partition key based on the data of event
      */
      const data = JSON.stringify(event);
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }
  }

  if (candidate) {
    if (typeof candidate !== "string") {
      /** The only way to get here is if by the "Specific partition key method"
       * because the "Generated partition key method" (using the SHA-3 512 algorithm)
       * is always going to return a string
      */
      candidate = JSON.stringify(candidate);
    }
  } else {
    /**
     * The only way to get here is if the event is null
    */
    candidate = TRIVIAL_PARTITION_KEY;
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    /** The only way to get here is if by the "Specific partition key method"
       * because the "Generated partition key method" is always going to return
       * a string with a length of 128 characters. This is due to the algorith
       * SHA-3 512, which means that we will get 512 bits, which in turn means
       * 64 bytes, each byte can be represented by a hexadecimal string of
       * 2 chars, so in total 128 chars.
      */
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  return candidate;
};
```

### Improvements to the code

- Clearly there are two different strategies to get a partition key. We can determine which method to use at the beginning by verifying if the `event.partitionKey` exists or if only `event` exists:
  - Specific partition key method
  - Generated partition key method

- Move the `string` type checking and length checking to the "Specific partition key method". If we are using the "Generated partition key method", we don't need to do these verifications.

- Take advantage of the latest advances in Javascript like [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) (supported from Node 14) to check if `event.partitionKey` exists. This will allow better readability by avoiding too many nested `if`s.

- By default given a null `event`, we should return the `TRIVIAL_PARTITION_KEY`.

- Add useful unit test cases for every method/strategy.

- Add documentation for the functions to understand what the code is doing.