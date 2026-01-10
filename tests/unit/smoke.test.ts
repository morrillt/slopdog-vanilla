import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("runs unit tests", () => {
    expect("slopdogrpg").toContain("rpg");
  });
});

