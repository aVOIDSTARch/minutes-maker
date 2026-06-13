import { biomeFormatter, prettierFormatter, type Piece } from "@avoidstarch/ts-kit";
import { writeFileWith, nodeWriter, type Formatter } from "@avoidstarch/ts-kit";

const p =
  (parser: string): Formatter =>
  (s) =>
    prettierFormatter(parser)(s);

const formatters: Record<string, Formatter> = {
  ".ts": biomeFormatter("f.ts"), // TS  → Biome (fast)
  ".css": biomeFormatter("f.css"), // CSS → Biome
  ".json": biomeFormatter("f.json"), // JSON→ Biome
  ".html": p("html"), // HTML→ Prettier (Biome HTML still maturing)
  // ".txt", ".md", unknown → identity, handled by formatterForPath
};

let tsPieces: Piece[] = [
  /* ... */
];
let schemaPieces: Piece[] = [
  /* ... */
];
let htmlPieces: Piece[] = [
  /* ... */
];

const write = writeFileWith(nodeWriter);
await write("out.ts", tsPieces, { formatters });
await write("schema.json", schemaPieces, { formatters });
await write("page.html", htmlPieces, { formatters });
