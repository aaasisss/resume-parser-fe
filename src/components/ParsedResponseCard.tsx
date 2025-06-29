import { Card, Typography } from "antd";

const { Title } = Typography;

function ParsedResponseCard({ response }: { response: any }) {
  let parsed = response;
  if (typeof response === "string") {
    const match = response.match(/```(?:json)?\n?([\s\S]*?)```/);
    if (match) {
      try {
        parsed = JSON.parse(match[1]);
      } catch {
        parsed = response;
      }
    }
  }
  return (
    <Card
      style={{
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        borderRadius: 16,
        overflow: "auto",
      }}
    >
      <Title level={4}>Parsed Response</Title>
      <pre
        style={{
          textAlign: "left",
          background: "#f4f4f4",
          padding: "1em",
          minHeight: 200,
          margin: 0,
          overflow: "auto",
        }}
      >
        {typeof parsed === "object"
          ? JSON.stringify(parsed, null, 2)
          : String(parsed)}
      </pre>
    </Card>
  );
}

export default ParsedResponseCard;
