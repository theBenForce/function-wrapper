import { FunctionWrapper } from "./index";
import AsyncWrapperOptions, { isAsyncMethod } from "./asyncWrapperOptions";

describe("AsyncWrapperOptions", () => {
  describe("execute", () => {
    test("Before methods can be promises", async () => {
      let callingArgs;
      const original = async (...args: Array<any>) => {
        callingArgs = args;
        return "ORIGINAL";
      };
      const newMethod = FunctionWrapper(original, {
        async: true,
        async before() {
          return ["BEFORE"];
        }
      });

      const result = await newMethod();

      expect(isAsyncMethod(newMethod)).toBeTruthy();

      expect(callingArgs).toContain("BEFORE");
      expect(result).toEqual("ORIGINAL");
    });

    test("Before methods can be regular functions", async () => {
      let callingArgs;
      const original = async (...args: Array<any>) => {
        callingArgs = args;
        return "ORIGINAL";
      };
      const newMethod = FunctionWrapper(original, {
        async: true,
        before() {
          return ["BEFORE"];
        }
      });

      const result = await newMethod();

      expect(isAsyncMethod(newMethod)).toBeTruthy();

      expect(callingArgs).toContain("BEFORE");
      expect(result).toEqual("ORIGINAL");
    });
  });
});
