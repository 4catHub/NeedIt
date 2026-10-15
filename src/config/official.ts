export const official = {
  hometax: "https://www.hometax.go.kr/",
  overview: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7664&mi=2224",
  filing: "https://b.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=238910&mi=40296",
  checkedAt: "2026-10-15",
};
export function isOfficialUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      ["nts.go.kr", "hometax.go.kr"].some(
        (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`),
      )
    );
  } catch {
    return false;
  }
}
