import kv from "@/lib/kv";
import { notFound } from "next/navigation";

export default async function PastePage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const data = await kv.hgetall<any>(`paste:${id}`);
  if (!data) notFound();

  return (
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {data.content}
    </pre>
  );
}
