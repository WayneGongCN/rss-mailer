```typescript
interface RenderData {
  data: {
    feed: Feed;
    original: string;
    parsed: Output<any>;
    filtered: Output<any>;
  }[]
  conf: Conf;
}

interface Data {
  feedUrl: string;
  items: Item[];
  lastBuildDate: Date;
  link: string;
}

interface Item {
  content: string;
  contentSnippet: string;
  id: string;
  isoDate: Date;
  link: string;
  pubDate: Date;
  summary: string;
  title: string;
}
```