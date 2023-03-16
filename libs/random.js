const titles = ["真", "凡", "笛", "勇", "辉", "光", "树"];

export async function title() {
  return titles[Math.floor(Math.random() * titles.length)];
}
