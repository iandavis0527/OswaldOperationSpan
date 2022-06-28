import { wait } from "./async";

test("test wait 1 second", async () => {
    let start = Date.now();
    await wait(250);
    let end = Date.now();
    expect(Math.abs(end - (start + 250))).toBeLessThan(20);
});
