import { isUuid, OPTIONAL } from "..";
import { expect } from "chai";
import { UuidOptions } from "./uuid";

interface Test {
  it: string;
  value: any;
  expected: string | undefined | typeof OPTIONAL;
  opts?: UuidOptions;
}
const tests: Test[] = [
  {
    it: "return undefined when given an arbitrary string",
    value: "omg arbitrary",
    expected: undefined
  },
  {
    it: "return undefined when given a missing string",
    value: undefined,
    expected: undefined
  },
  {
    it: "return OPTIONAL when optional and given a missing string",
    value: undefined,
    expected: OPTIONAL,
    opts: { optional: true }
  },
  {
    it: "return undefined when optional and given an empty string",
    value: "",
    expected: undefined,
    opts: { optional: true }
  },
  {
    it: "return undefined when optional and given an arbitrary string",
    value: "omg arbitrary again",
    expected: undefined,
    opts: { optional: true }
  },
  {
    it: "return the string when given a valid UUID",
    value: "5757c0e0-3b07-11e9-b210-d663bd873d93",
    expected: "5757c0e0-3b07-11e9-b210-d663bd873d93",
    opts: { optional: true }
  },
  {
    it: "return undefined when given a corrupt UUID (missing dash)",
    value: "5757c0e0-3b07-11e9-b210d663bd873d93",
    expected: undefined,
    opts: { optional: true }
  },
  {
    it: "return undefined when given a corrupt UUID (short segment)",
    value: "757c0e0-3b07-11e9-b210-d663bd873d93",
    expected: undefined,
    opts: { optional: true }
  },
  {
    it: "return undefined when given a corrupt UUID (missing segment)",
    value: "5757c0e0-3b07--b210-d663bd873d93",
    expected: undefined,
    opts: { optional: true }
  }
];

describe("isUuid()", () => {
  for (const test of tests) {
    it(`will ${test.it}`, () => {
      const actual = isUuid(test.value, test.opts);
      expect(actual).to.equal(test.expected);
    });
  }
});
