// @flow
export default function topuid (): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c: string): string {
    let r = Math.random()*16|0
    let v = c === "x" ? r : ((r&0x3)|0x8)
    return v.toString(16);
  });
}
